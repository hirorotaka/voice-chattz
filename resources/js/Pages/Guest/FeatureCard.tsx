interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
        <div className="flex mb-2">
            <div className="text-indigo-400 text-2xl mr-4">{icon}</div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
    </div>
);
