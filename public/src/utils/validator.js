export const validateNIM = (nim) => {
    return /^\d{10,12}$/.test(nim);
};

export const validateEmpty = (data) => {
    return Object.values(data).every(val => val !== "");
};