import moment from "moment";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

const FilterInfoTitle = ({ type, searchQuery, filterDates, onHandleClear }) => {
    const DataRangeChip = ({ date }) => {
        const startDate = date?.from ? moment(date?.from).format("Do MMM YYYY")
            : "N/A";
        const endDate = date?.to ? moment(date?.to).format("Do MMM YYYY") : "N/A";

        return (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
                <p className="text-xs font-medium">
                    {startDate} - {endDate}
                </p>

                <button onClick={onHandleClear}>
                    <MdOutlineClose />
                </button>
            </div>
        );
    };

    return (
        type && (
            <div className="mb-5">
                {type === "search" && (
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">Search Results for "{searchQuery}"</h3>
                        <button 
                            onClick={onHandleClear}
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full flex items-center"
                        >
                            <MdOutlineClose className="mr-1" /> Clear
                        </button>
                    </div>
                )}
                
                {type === "date" && (
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-medium">Travel Stories from</h3>
                        <DataRangeChip date={filterDates} />
                    </div>
                )}

                {type === "no-results" && (
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">No Results Found</h3>
                        <button 
                            onClick={onHandleClear}
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full flex items-center"
                        >
                            <MdOutlineClose className="mr-1" /> Clear Filters
                        </button>
                    </div>
                )}

                {type === "offline" && (
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">Offline Stories</h3>
                    </div>
                )}

                {type === "favorites" && (
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">Favorite Stories</h3>
                    </div>
                )}

                {type === "advanced" && (
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium">Advanced Search Results</h3>
                        <button 
                            onClick={onHandleClear}
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full flex items-center"
                        >
                            <MdOutlineClose className="mr-1" /> Clear Filters
                        </button>
                    </div>
                )}
            </div>
        )
    );
};

export default FilterInfoTitle;