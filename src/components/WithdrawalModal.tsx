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

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  color: string;
  status: 'active' | 'suspended' | 'disabled';
  message?: string;
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.public.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method,
          recipient,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process withdrawal');
      }

      toast.success(t('withdrawal.success'));
      onClose();
      dispatch(fetchUserData());
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('withdrawal.title')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('withdrawal.amount')}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            onChange={(e) => setMethod(e.target.value)}
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
            onChange={(e) => setRecipient(e.target.value)}
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
    </Modal>
  );
};

export default WithdrawalModal; 