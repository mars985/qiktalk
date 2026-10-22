export const minLengthMessage = (field: string, min: number) =>
  `${field} must be at least ${min} character(s)`;

export const maxLengthMessage = (field: string, max: number) =>
  `${field} cannot exceed ${max} character(s)`;
