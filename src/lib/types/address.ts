// Address types for marketplace frontend

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER',
}

export interface Address {
  id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  address_type: AddressType;
  label?: string;
  company_name?: string;
  floor_details?: string;
  is_primary: boolean;
  is_active: boolean;
  patient_user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAddressDto {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  address_type?: AddressType;
  label?: string;
  company_name?: string;
  floor_details?: string;
  is_primary?: boolean;
}

export interface UpdateAddressDto {
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  landmark?: string;
  address_type?: AddressType;
  label?: string;
  company_name?: string;
  floor_details?: string;
  is_primary?: boolean;
  is_active?: boolean;
}

export interface AddressApiResponse {
  success: boolean;
  data: Address;
  message?: string;
}

export interface AddressListApiResponse {
  success: boolean;
  data: Address[];
  message?: string;
}

// For form components
export interface AddressFormData {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark: string;
  address_type: AddressType;
  label: string;
  company_name: string;
  floor_details: string;
  is_primary: boolean;
}

// For address selection components
export interface AddressSelectOption {
  value: string;
  label: string;
  address: Address;
}

// For booking flow
export interface BookingAddress {
  id: string;
  full_address: string;
  pincode: string;
  label?: string;
  is_primary: boolean;
}