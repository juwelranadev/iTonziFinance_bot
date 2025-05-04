'use client';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    dictionary?: {
        about: string;
        close: string;
        welcome: string;
        description: string;
        features: string;
        howItWorks: string;
        support: string;
        version: string;
    };
}

export default function AboutModal({ 
    isOpen, 
    onClose,
    dictionary = {
        about: 'About iTonziFinance',
        close: 'Close',
        welcome: 'Welcome to iTonziFinance',
        description: 'Your premier platform for earning rewards through ad engagement',
        features: 'Key Features',
        howItWorks: 'Getting Started',
        support: 'Contact Support',
        version: 'Version'
    }
}: AboutModalProps) {
    if (!isOpen) return null;

    const features = [
        { icon: '💰', title: 'Reward System', description: 'Earn tokens by watching advertisements' },
        { icon: '🎯', title: 'Daily Missions', description: 'Complete daily tasks for extra rewards' },
        { icon: '🔄', title: 'Smart Automation', description: 'Seamless ad viewing experience' },
        { icon: '📊', title: 'Analytics', description: 'Monitor your earnings and performance' },
        { icon: '🏆', title: 'Milestones', description: 'Achieve goals and unlock bonuses' },
        { icon: '💳', title: 'Flexible Payouts', description: 'Multiple withdrawal methods' }
    ];

    const howItWorks = [
        'Connect your Telegram account',
        'Start watching ads to earn',
        'Complete daily missions',
        'Monitor your progress',
        'Withdraw your earnings'
    ];

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-2xl md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500 to-cyan-500">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{dictionary.about}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-8 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                    {/* Welcome Section */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {dictionary.welcome}
                        </h1>
                        <p className="text-gray-400">{dictionary.description}</p>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.features}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-blue-500/30 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white">{feature.title}</h4>
                                            <p className="text-sm text-gray-400">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.howItWorks}</h3>
                        <div className="space-y-4">
                            {howItWorks.map((step, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                                        {index + 1}
                                    </div>
                                    <p className="text-gray-300">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">{dictionary.support}</h3>
                        <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
                                    💬
                                </div>
                                <div>
                                <p>  <p className="text-gray-300">Need help? Contact our support team through Telegram </p>
                                   channel <a href="https://t.me/iTonziFinanceChannel" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                        @iTonziFinanceChannel  </a></p>

                                        <p> Admin/Ceo <a href="https://t.me/zikrulislam84" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                        @ZIKRULISLAM </a></p>

                                        devoloper <a href="https://t.me/MdRijonHossainJibon" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                                        @MdRijonHossainJibon


                                        
                                        

                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Version */}
                    <div className="text-center text-sm text-gray-500">
                        {dictionary.version} 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
};
