import type { ReactNode } from 'react';

export interface MenuItem {
  title: string;
  items: Array<{
    label: string;
    url: string;
  }>;
  description: string;
  url?: string;
  icon: any;
}

export interface SelectOption {
  _id: string | number;
  name: string;
  // ... add other properties your options might have
}

export interface BankAccount {
  id: string;
  organization_id: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  bank_name: string;
  default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SidebarProps {
  menuItems?: MenuItem[]
}


export type ChildrenProps = {
  children: ReactNode;
};

export interface User {

}

export interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export interface Address {
  _id: string;
  address1: string;
  address2: string;
  address_type: 'billing' | 'corporate';
  country_id: string;
  state_id: string;
  city_id: string;
  pincode: string;
  default: boolean;
  country?: string;
  state?: string;
  city?: string;
}

export interface SignInResponse {
  data: {
    auth_token: string;
    if_verified?: boolean;
    refresh_token: string;
  };
  message?: string;
}


export interface Slab {
  range_start: number;
  range_end: number;
  price_per_credit: number;
}

export interface ProjectData {
  actual_annual_estimated_reductions: number;
  manager_credits?: string;
  vintages?: {
    price_slabs: Slab[];
    year: number;
    available_credits: number;
    credits_for_sale?: number;
    credit_price?: number;
  }[];
  // Add other properties as needed
}
export interface SignInInput {
  email: string;
  password: string;
}

export type VintageNotAvailableInput = {
  totalCredits: string;
  creditsForSell: string | number;
  creditingPeriod: (Date | undefined)[];
  activateCredits: (Date | undefined)[];
}

export type TabType = 'details' | 'specifications' | 'enrichment' | 'management';

export interface CountryList {
  _id: string;
  name: string;
}
export interface StateList {
  _id: string;
  name: string;
}

export interface CityList {
  _id: string;
  name: string;
}


export interface RequiredDocument {
  Name: string;
  Description?: string;
  Required: boolean;
}

export interface CountryObject {
  ID: string;
  Name: string;
  SortName: string;
  RequiredDocuments: RequiredDocument[];
  CompanyNumberField: string;
}
