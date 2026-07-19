import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, center = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className={`mb-12 ${center ? 'text-center' : ''}`}
        >
            {subtitle && (
                <span className="block text-sm font-semibold text-gradient uppercase tracking-widest mb-3">
                    {subtitle}
                </span>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white relative inline-block">
                {title}
                <span className={`absolute -bottom-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent-500 to-cyanic-400 ${center ? 'left-1/2 -translate-x-1/2' : 'left-0'}`}></span>
            </h2>
        </motion.div>
    );
};

export default SectionTitle;
