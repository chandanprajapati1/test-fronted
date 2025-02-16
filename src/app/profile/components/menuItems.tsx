import { MenuItem } from "@/types";
import { Routes } from "@/config/routes";
import {
    LocationCompany,
    PiggyBank,
    DocumentSigned,
    Security,
    Account,
    SettingsAdjust,
    CloudLogging
} from "@carbon/icons-react";


export const sidebarMenuItems: MenuItem[] = [
    {
        title: "Address",
        items: [
            { label: "Registered Address", url: Routes.ProfileAddress },
            { label: "Billing Address", url: Routes.ProfileAddress }
        ],
        description: "Official location of corporate headquarters",
        url: Routes.ProfileAddress,
        icon: <LocationCompany className="w-8 h-8 text-neutral-1200" />
    },
    {
        title: "Bank Details",
        items: [
            { label: "Primary Account", url: Routes.ProfileAccount },
            { label: "Other Account", url: Routes.ProfileAccount }
        ],
        description: "Financial information",
        url: Routes.ProfileAccount,
        icon: <PiggyBank className="w-8 h-8 text-neutral-1200" />,
    },
    {
        title: "Login Security",
        items: [
            { label: "Reset Password", url: Routes.ProfilePasswordReset }
        ],
        description: "Safeguarding your account",
        url: Routes.ProfilePasswordReset,
        icon: <DocumentSigned className="w-8 h-8 text-neutral-1200" />,
    },
    {
        title: "KYC",
        items: [
            { label: "Status", url: Routes.ProfileKYC }
        ],
        description: "Ensure compliance",
        url: Routes.ProfileKYC,
        icon: <Security className="w-8 h-8 text-neutral-1200" />,
    }, {
        title: "Orders",
        items: [
            { label: "Order & details", url: Routes.ProfileOrders }
        ],
        description: "Purchase history and current order status",
        url: Routes.ProfileOrders,
        icon: <Account className="w-8 h-8 text-neutral-1200" />,
    },
    {
        title: "Projects",
        items: [
            { label: "Add project", url: Routes.ProjectCreate },
            { label: "List of projects", url: Routes.ProfileProjects },
            // { label: "Status", url: "" }
        ],
        description: "Ongoing and completed initiatives",
        url: Routes.ProfileProjects,
        icon: <CloudLogging className="w-8 h-8 text-neutral-1200" />,
    },
    {
        title: "Negotiations",
        items: [
            { label: "Negotiation details", url: Routes.ProfileNegotiation }
        ],
        description: "Documented discussions and agreements",
        url: Routes.ProfileNegotiation,
        icon: <SettingsAdjust className="w-8 h-8 text-neutral-1200" />,
    },
    /*{
        title: "Credit Holdings",
        items: [
            { label: "Credits Details", url: Routes.ProfileCredits }
        ],
        description: "Credits you own",
        icon: Projects,
    },
    {
        title: "Notification Settings",
        items: [
            { label: "Customize your alerts", url: Routes.ProfileNegotiation }
        ],
        description: "Customize your alerts and updates",
        icon: Notifications,
    },
    {
        title: "Recent Activities",
        items: [
            { label: "Latest Updates", url: Routes.ProfileActivities }
        ],
        description: "Latest interactions and updates",
        icon: Activities,
    }*/
];