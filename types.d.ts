interface FormState {
  error: string | null;
}

interface SessionPayload {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
  expiresAt: Date;
}

interface CustomerWhereConditions {
  AND?: Array<{
    OR?: Array<{
      username?: {
        contains?: string;
        mode?: "insensitive" | "default";
      };
      customerDetails?: {
        fullName?: {
          contains?: string;
          mode?: "insensitive" | "default";
        };
        email?: {
          contains?: string;
          mode?: "insensitive" | "default";
        };
      };
    }>;
    customerDetails?: {
      status?: string;
    };
  }>;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  className?: string;
  preserveParams?: Record<string, string | number | boolean | undefined>;
  labels?: {
    itemsLabel?: string;
    showingText?: string;
    displayingText?: string;
    ofText?: string;
    prevText?: string;
    nextText?: string;
  };
}

interface CustomerFormData {
  [key: string]: string;
  username: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
  idCardNumber: string;
  familyCardNumber: string;
  birthDate: string;
  birthPlace: string;
  status?: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  registrationDate?: string;
  subscriptionDate?: string;
  password?: string;
  confirmPassword?: string;
}

interface UpdateCustomerFormData extends CustomerFormData {
  id: string;
}

interface PasswordUpdateData {
  [key: string]: string;
  id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CustomerPaginationParams {
  take: string;
  skip: string;
  status?: CustomerStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface RequestPaginationParams {
  take: string;
  skip: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface BillPaginationParams {
  take: string;
  skip: string;
  paymentStatus?: "PAID" | "UNPAID" | "IN_REVIEW" | "REJECTED";
  month?: string;
  year?: string;
  customerId?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

interface ReportPaginationParams {
  take: string;
  skip: string;
  search?: string;
  startPeriod?: string;
  endPeriod?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface ComplaintPaginationParams {
  take: string;
  skip: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: "OPEN | IN_PROGRESS | RESOLVED | CLOSED";
  customerId?: string;
  category?:
    | "VIDEO_ISSUE"
    | "AUDIO_ISSUE"
    | "CHANNEL_ISSUE"
    | "BILLING_ISSUE"
    | "INSTALLATION"
    | "SERVICE_STAFF"
    | "OTHERS";
}
