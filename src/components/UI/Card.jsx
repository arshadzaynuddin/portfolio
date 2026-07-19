const Card = ({ children, className = "" }) => {
    return (
        <div className={`glass glass-hover rounded-2xl p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
