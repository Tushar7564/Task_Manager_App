const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => emailPattern.test(value.trim());

export const validateLogin = ({ email, password }) => {
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Please enter a valid email.";
  if (!password) return "Password is required.";
  return "";
};

export const validateRegister = ({ name, email, password }) => {
  if (!name.trim()) return "Name is required.";
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Please enter a valid email.";
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
};

export const validateDateValue = (value) => {
  if (!value) return true;

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

export const validateTaskPayload = ({ title, dueDate }) => {
  if (!title.trim()) return "Title is required.";
  if (title.trim().length < 3) return "Title must be at least 3 characters.";
  if (!validateDateValue(dueDate)) return "Due date must be a valid date.";
  return "";
};

export const validateProjectPayload = ({ name }) => {
  if (!name.trim()) return "Project name is required.";
  return "";
};
