export const getTimeStatus = (expirationDate: Date): string => {
    if (!expirationDate) return "";
    const now = new Date();
    const expiry = new Date(expirationDate);

    if (isNaN(expiry.getTime())) return "";

    const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const d2 = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expiring Today";
    if (diffDays === 1) return "Expiring Tomorrow";
    return `Expiring in ${diffDays} days`;
};

export const parseSalary = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        return Number(val.replace(/[^0-9.]/g, ''));
    }
    return 0;
};
