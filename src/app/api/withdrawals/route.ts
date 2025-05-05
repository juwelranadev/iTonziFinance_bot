import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import WithdrawalHistory from '@/models/WithdrawalHistory';

interface Withdrawal {
    _doc: {
        _id: string;
        userId: string;
        amount: number;
        method: string;
        recipient: string;
        status: string;
        createdAt: Date;
    };
    method: string;
    amount: number;
    telegramId?: string;
}

// Constants for conversion and fees
const MIN_CRYPTO_AMOUNT = 50; // Minimum withdrawal amount
const MAX_CRYPTO_AMOUNT = 1000; // Maximum withdrawal amount
const USD_TO_BDT_RATE = 110; // 1 USD = 110 BDT
const MIN_BDT_AMOUNT = 50;
const MAX_BDT_AMOUNT = 25000;

// Fee structure for different payment methods
const FEE_STRUCTURE = {
    bdt: { percentage: 1, fixed: 0 }, // 1% fee
    bank: { percentage: 1, fixed: 0 }, // 1% fee
    bkash: { percentage: 1, fixed: 0 }, // 1% fee
    nagad: { percentage: 1, fixed: 0 }, // 1% fee
    rocket: { percentage: 1, fixed: 0 }, // 1% fee
    upay: { percentage: 1, fixed: 0 }, // 1% fee
    tap: { percentage: 1, fixed: 0 }, // 1% fee
};

// Helper function to calculate fee
function calculateFee(amount: number, method: string): number {
    const feeStructure = FEE_STRUCTURE[method as keyof typeof FEE_STRUCTURE] || FEE_STRUCTURE.bdt;
    const percentageFee = (amount * feeStructure.percentage) / 100;
    return percentageFee + feeStructure.fixed;
}

// Helper function to validate Bangladeshi phone number
function validateBangladeshiPhoneNumber(number: string): boolean {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Handle both local (01) and international (+880) formats
    let localFormat = cleanNumber;
    if (cleanNumber.startsWith('880')) {
        localFormat = cleanNumber.slice(3); // Remove 880 prefix
    }

    // Check if it starts with 0
    if (localFormat.startsWith('0')) {
        localFormat = localFormat.slice(1); // Remove leading 0
    }
    
    // Now the number should be just 10 digits starting with 1
    if (localFormat.length !== 10 || !localFormat.startsWith('1')) {
        return false;
    }

    // Check if it starts with valid Bangladesh operator codes
    const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
    const prefix = localFormat.substring(0, 2);
    
    return validPrefixes.includes(prefix);
}

// Helper function to validate crypto address
function validateCryptoAddress(address: string, method: string): boolean {
    const addressRegex = {
        bitget: /^[0-9a-zA-Z]{34,42}$/,
        binance: /^0x[0-9a-fA-F]{40}$/
    };

    if (method === 'bitget' || method === 'binance') {
        return addressRegex[method].test(address);
    }

    return true; // For non-crypto methods
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const withdrawals = await WithdrawalHistory.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { amount, method, recipient } = await req.json();

        if (!amount || !method || !recipient) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const withdrawalAmount = parseFloat(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount < MIN_CRYPTO_AMOUNT || withdrawalAmount > MAX_CRYPTO_AMOUNT) {
            return NextResponse.json({ error: `Amount must be between ${MIN_CRYPTO_AMOUNT} and ${MAX_CRYPTO_AMOUNT} BDT` }, { status: 400 });
        }

        if (withdrawalAmount > user.balance) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        const fee = calculateFee(withdrawalAmount, method);
        const totalAmount = withdrawalAmount + fee;

        if (totalAmount > user.balance) {
            return NextResponse.json({ error: 'Insufficient balance to cover fee' }, { status: 400 });
        }

        if (method === 'bank' && !validateBangladeshiPhoneNumber(recipient)) {
            return NextResponse.json({ error: 'Invalid bank account number' }, { status: 400 });
        }

        if (method !== 'bank' && !validateBangladeshiPhoneNumber(recipient)) {
            return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
        }

        const withdrawal = await WithdrawalHistory.create({
            userId: user._id,
            amount: withdrawalAmount,
            method,
            recipient,
            status: 'pending',
            fee
        });

        user.balance -= totalAmount;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Withdrawal request submitted successfully',
            withdrawal
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { withdrawalId, status, reason } = data;

        if (!withdrawalId || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const withdrawal = await WithdrawalHistory.findById(withdrawalId);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Can only update pending withdrawals' }, { status: 400 });
        }

        // Update withdrawal status
        withdrawal.status = status;
        await withdrawal.save();

        // Create withdrawal history record
        await WithdrawalHistory.create({
            telegramId: withdrawal.telegramId,
            activityType: status === 'approved' ? 'withdrawal_approved' : 'withdrawal_rejected',
            amount: withdrawal.amount,
            method: withdrawal.method,
            recipient: withdrawal.recipient,
            status,
            description: status === 'approved' 
                ? `Withdrawal request approved for ${withdrawal.amount} BDT via ${withdrawal.method}`
                : `Withdrawal request rejected for ${withdrawal.amount} BDT via ${withdrawal.method}`,
            metadata: {
                adminId: session.user._id,
                reason,
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                deviceInfo: req.headers.get('user-agent')
            }
        });

        // If rejected, refund the amount
        if (status === 'rejected') {
            await User.findByIdAndUpdate(withdrawal.userId, {
                $inc: { balance: withdrawal.amount }
            });
        }

        return NextResponse.json({
            message: `Withdrawal ${status} successfully`,
            withdrawal: withdrawal.toObject()
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing withdrawal ID' }, { status: 400 });
        }

        const withdrawal = await WithdrawalHistory.findById(id).populate('userId', 'telegramId');
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Can only cancel pending withdrawals' }, { status: 400 });
        }

        // Create withdrawal history record for cancellation
        await WithdrawalHistory.create({
            telegramId: withdrawal.telegramId,
            activityType: 'withdrawal_rejected',
            amount: withdrawal.amount,
            method: withdrawal.method,
            recipient: withdrawal.recipient,
            status: 'rejected',
            description: `Withdrawal request cancelled by user for ${withdrawal.amount} BDT via ${withdrawal.method}`,
            metadata: {
                reason: 'User cancelled withdrawal',
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                deviceInfo: req.headers.get('user-agent')
            }
        });

        // Refund the BDT amount to user's balance
        await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { balance: withdrawal.amount }
        });

        await WithdrawalHistory.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Withdrawal cancelled successfully',
            refundedAmount: withdrawal.amount,
            refundedAmountBDT: withdrawal.amount * USD_TO_BDT_RATE
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to cancel withdrawal' }, { status: 500 });
    }
} 