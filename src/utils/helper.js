import addStory from '../../src/assets/images/addStory.gif'
import noSearch from '../../src/assets/images/no-search.gif'
import noCal from '../../src/assets/images/no-calendar.gif'

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials =(name) =>{
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i=0;i<Math.min(words.length,2);i++)
    {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}


export const getEmptyCardMessage = (filterType) =>{
    switch(filterType){
        case "search":
            return `Sorry Traveller! No stories found matching to your search.`;

        case "date":
            return `Sorry Traveller! No stories found in the given data range.`;    
        
        default:
            return `Click the "Add" button in the bottom right corner to start your first travel story. Write down your thoughts, ideas, and memories!`;
    }
}


export const getEmptyImg = (filterType) =>{
    switch(filterType){
        case "search":
            return noSearch;

        case "date":
            return noCal;    
        
        default:
            return addStory;
    }
}

// Generate a random color for chart use
export const getRandomColor = () => {
    // Generate pastel colors for better visual appeal
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 80%, 0.8)`;
};
