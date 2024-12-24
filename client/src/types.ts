export interface ApiError {
  response?: {
    data: {
      errors: Array<{ detail: string }>;
    };
  };
}
