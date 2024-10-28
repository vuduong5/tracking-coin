function convertTimestampToDateTime(timestamp) {
   // Convert timestamp directly (since it includes milliseconds)
    const date = new Date(parseFloat(timestamp));

    // Extract date parts
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    // Extract time parts
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return formatted datetime string
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function isToday(timestamp) {
    // Convert timestamp to a Date object
    const date = new Date(timestamp);
    
    // Get today's start and end (midnight to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (midnight)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    // Check if timestamp falls within today
    return date >= today && date < tomorrow;
}

module.exports = {
    convertTimestampToDateTime,
    isToday
}