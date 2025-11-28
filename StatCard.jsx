import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const StatCard = ({ icon: Icon, title, value, gradient, delay = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Animated counter effect
        const duration = 1000; // 1 second
        const steps = 50;
        const increment = value / steps;
        let current = 0;

        const timer = setTimeout(() => {
            const counter = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(counter);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(counter);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div
            className={`${gradient} p-6 rounded-2xl shadow-xl hover-lift animate-fadeIn text-white relative overflow-hidden`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 opacity-20">
                <Icon className="h-32 w-32 transform rotate-12" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-xl backdrop-blur-sm">
                        <Icon className="h-8 w-8" />
                    </div>
                </div>
                <h3 className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wider mb-2">
                    {title}
                </h3>
                <p className="text-4xl font-bold">
                    {count}
                </p>
            </div>
        </div>
    );
};

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    gradient: PropTypes.string.isRequired,
    delay: PropTypes.number,
};

export default StatCard;
