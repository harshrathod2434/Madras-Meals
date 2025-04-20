const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:2000/api';
const MENU_ITEM_ID = '6804be39ccf61fe5451ba635'; // Plain Dosa
const ADMIN_CREDENTIALS = {
  email: 'admin@madrasmeals.com',
  password: 'adminPassword123'
};

async function testMenuItemUpdate() {
  try {
    console.log('Starting test...');

    // Step 1: Login and get token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, ADMIN_CREDENTIALS);
    const token = loginResponse.data.token;
    console.log('Login successful. Token received.');

    // Step 2: Get the current menu item
    console.log(`Fetching current state of menu item ${MENU_ITEM_ID}...`);
    const getItemResponse = await axios.get(`${API_URL}/menu/${MENU_ITEM_ID}`);
    const currentItem = getItemResponse.data;
    console.log('Current item state:', currentItem);

    // Step 3: Create form data for the update
    const formData = new FormData();
    const timestamp = new Date().toISOString();
    formData.append('name', `Plain Dosa Updated (${timestamp})`);
    formData.append('description', `Updated description for testing - ${timestamp}`);
    formData.append('price', '125.99');

    // Step 4: Send update request
    console.log('Sending update request with form data:');
    console.log('- name:', `Plain Dosa Updated (${timestamp})`);
    console.log('- description:', `Updated description for testing - ${timestamp}`);
    console.log('- price:', '125.99');

    const updateResponse = await axios.put(
      `${API_URL}/menu/${MENU_ITEM_ID}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );

    console.log('Update response:', updateResponse.data);

    // Step 5: Verify update
    console.log('Verifying update...');
    const verifyResponse = await axios.get(`${API_URL}/menu/${MENU_ITEM_ID}`);
    console.log('Updated item:', verifyResponse.data);

    // Step 6: Check if update was successful
    const updatedItem = verifyResponse.data;
    if (updatedItem.name.includes(timestamp) && 
        updatedItem.description.includes(timestamp) && 
        updatedItem.price === 125.99) {
      console.log('✅ Test PASSED: Menu item was successfully updated.');
    } else {
      console.log('❌ Test FAILED: Menu item was not updated correctly.');
      console.log('Expected:', {
        name: `Plain Dosa Updated (${timestamp})`,
        description: `Updated description for testing - ${timestamp}`,
        price: 125.99
      });
      console.log('Actual:', {
        name: updatedItem.name,
        description: updatedItem.description,
        price: updatedItem.price
      });
    }

  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testMenuItemUpdate(); 