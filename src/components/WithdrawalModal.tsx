import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, ChevronDownIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Image } from 'antd-mobile';
import { toast } from 'react-toastify';
import { withdrawalApi } from '@/modules/public/withdrawal/api';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserBalance } from '@/store/selectors/userSelectors';
import { HistoryOutlined } from '@ant-design/icons';
import WithdrawalHistory from './WithdrawalHistory';
import { fetchUserData } from '@/store/actions/userActions';
import { RootState } from '@/modules/store';

interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    minAmount: number;
    maxAmount: number;
    fee: number;
}

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface WithdrawalResponse {
    success: boolean;
    message?: string;
    withdrawal?: any;
}

export default function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await withdrawalApi.createWithdrawal({
                amount: parseFloat(amount),
                method,
                recipient
            }) as WithdrawalResponse;

            if (response?.success) {
                toast.success(t('withdrawal.success'));
                dispatch(fetchUserData());
                onClose();
            } else {
                setError(response?.message || t('withdrawal.error'));
            }
        } catch (err) {
            setError(t('withdrawal.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                    >
                        {t('withdrawal.title')}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {t('withdrawal.amount')}
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                placeholder="Enter amount"
                                required
                            />
                            <div className="mt-1 text-sm text-gray-400">
                                {t('withdrawal.available', 'Available')}: <span className="text-white">{user?.balance?.toFixed(2)} BDT</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {t('withdrawal.method')}
                            </label>
                            <select
                                value={method}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                required
                            >
                                <option value="">{t('withdrawal.selectMethod')}</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="rocket">Rocket</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                {t('withdrawal.recipient')}
                            </label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                placeholder={method === 'bank' ? 'Enter bank account number' : 'Enter phone number'}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
                        >
                            {isLoading ? t('withdrawal.processing') : t('withdrawal.submit')}
                        </button>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 