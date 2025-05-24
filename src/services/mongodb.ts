//  MongoDB connection utility
const MONGODB_URI = "mongodb+srv://hello:helloskibidimark123@cluster0.tzi8u.mongodb.net/myDatabase?retryWrites=true&w=majority";

// Connect to MongoDB through proxy
const connectToMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // In a production app, we would connect to the database here
    // For this example, we're simulating a connection
    
    // If we were using the real MongoDB, we would send a request through our proxy
    /*
    const response = await fetch('https://hooks.jdoodle.net/proxy?url=https://data.mongodb-api.com/app/data-api/endpoint/data/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MONGODB_URI}`
      },
      body: JSON.stringify({
        action: 'ping'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to connect to MongoDB');
    }
    */
    
    // Set timeout to simulate connection time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      connected: true,
      message: 'Connected to MongoDB'
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return {
      connected: false,
      message: 'Failed to connect to MongoDB'
    };
  }
};

export default connectToMongoDB;
 