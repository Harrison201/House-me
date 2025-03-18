// helpers/properties.js

// Helper function to generate random apartment titles
const getRandomTitle = () => {
    const titles = [
        "Sunset Paradise Apartments", 
        "Green Valley Estates", 
        "Oceanview Villas", 
        "Highland Meadows", 
        "Cityscape Towers",
        "Palm Grove Residences", 
        "Crystal Bay Suites", 
        "Riverside Retreat",
        "Mountain View Lodge", 
        "The Grand Plaza"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
};

// Helper function to generate random property descriptions
const getRandomDescription = () => {
    const descriptions = [
        "A beautiful, spacious home with modern amenities and breathtaking views.",
        "Nestled in a serene environment, this property offers ultimate comfort and luxury.",
        "Perfect for families, this home has an expansive living area and a well-designed kitchen.",
        "A cozy and elegant home with all the features needed for comfortable living.",
        "This property boasts a contemporary design with high-end finishes and large windows.",
        "A charming residence with an open-concept layout and plenty of natural light.",
        "Enjoy a peaceful lifestyle in this home with a private garden and spacious bedrooms.",
        "An ideal home for those who love elegance and modern architecture.",
        "This property features state-of-the-art appliances and a fully furnished kitchen.",
        "Located in a prime area, this home offers easy access to schools, shopping centers, and parks."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Generate the sample data array for properties
const generateProperties = () => {
    return Array.from({ length: 6 }, () => ({
        image: `/images/a${Math.ceil(Math.random() * 6)}.jpg`,
        status: 'Rent',
        price: `Ksh ${((Math.random() * 5) + 1).toFixed(1)}m`,
        title: getRandomTitle(),
        beds: Math.floor(Math.random() * 5) + 1,
        baths: Math.floor(Math.random() * 3) + 1,
        kitchen: Math.floor(Math.random() * 2) + 1, // 1 or 2 kitchens
        location: '778 Panama City, FL',
        description: getRandomDescription()
    }));
};

// Export the function to generate properties
module.exports = { generateProperties };

