import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getRegisterNamesAndIds, getSectorNamesAndIdsWithoutRegistry } from '../projectOnboarding/SpecificationApis';
import SelectField from "@/components/ui/selectFieldFilter";

const statusList: any = [
    {
        name: "All",
        _id: "all"
    },
    {
        name: "Listed",
        _id: "listed"
    },
    {
        name: "Verified",
        _id: "verified"
    }
];

const SearchFilterBar = (props: any) => {
    const [registryList, setRegistryList] = useState<any[]>([]);
    const [sectorList, setSectorList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedRegistryId, setSelectedRegistryId] = useState<string | null>(null);
    const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
    const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

    const fetchRegistryList = async () => {
        try {
            const list = await getRegisterNamesAndIds();
            setRegistryList([{ name: 'All', _id: 'all' }, ...list]);
        } catch (e: any) {
            console.log(e);
        }
    };

    const fetchSectorList = async () => {
        try {
            const list = await getSectorNamesAndIdsWithoutRegistry();
            setSectorList([{ name: 'All', _id: 'all' }, ...list]);
        } catch (e: any) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchSectorList();
        fetchRegistryList();
    }, []);

    useEffect(() => {
        props.setParamsData({
            'register': selectedRegistryId,
            "sector": selectedSectorId,
            'status': selectedStatusId,
            'search': searchText.length > 4 ? searchText : ""
        })
    }, [searchText, selectedRegistryId, selectedSectorId, selectedStatusId]);

    return (
        //mt-56 sc-xs:mt-32 sc-md:mt-8 flex flex-col w-full justify-center py-m px-6  max-w-screen-sc-2xl mx-auto
        <div className="absolute left-0 right-0 flex flex-col sc-sm:flex-row max-w-screen-sc-2xl mx-auto w-full -translate-y-20 justify-center z-40 px-6 py-4">
            <div className='w-full sc-sm:w-full px-6 bg-white shadow-md flex flex-col sc-md:flex-row items-center rounded-lg py-l justify-between gap-y-2'>
                <div className="flex sc-sm:flex-row items-center border rounded-3xl px-l py-m w-full sc-md:max-w-[250px]">
                    <input
                        type="text"
                        placeholder="Search Project"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-transparent outline-none w-full text-neutral-1000 text-f-l font-light"
                    />
                    <FaSearch className="text-gray-500 ml-2" />
                </div>

                <div className="flex flex-col sc-xl:flex-row sc-md:flex-row items-start w-full gap-4">
                    <div className="flex flex-col sc-xs:flex-row w-full items-center  gap-4">
                        <div className='text-neutral-1000 text-f-l font-light w-full sc-md:text-right'>Sort By</div>
                        <Dropdown label="Status" options={statusList} setSelectedId={setSelectedStatusId}/>
                    </div>
                    <div className="flex flex-col sc-xs:flex-row gap-4 w-full">
                        <Dropdown label="Registry" options={registryList} setSelectedId={setSelectedRegistryId}/>
                        <Dropdown label="Sector" options={sectorList} setSelectedId={setSelectedSectorId}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface DropdownProps {
    label: string;
    options: any[];
    setSelectedId: any;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, setSelectedId }) => {
    const [selectedName, setSelectedName] = useState<string | number | undefined >(undefined);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        setSelectedName(event.target.value);
        setSelectedId(event.target.value);
        setOpen(false);
        console.log(`Selected ID: ${event.target.value}`);
    };
    return (
        <SelectField
            options={options}
            value={selectedName}
            onChange={handleSelectChange}
            placeholder={label}
            className=" w-full rounded-lg"
            selectClassName="w-full"
            selectBorderRadius = "24px"
        />
    );
};

export default SearchFilterBar;

