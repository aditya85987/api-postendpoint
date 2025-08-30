/**
 * BFHL API Serverless Function for Vercel
 * Implements the REST API specification for VIT Full Stack Question Paper
 */

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      is_success: false,
      error: 'Method not allowed. Only POST is supported.'
    });
  }

  try {
    // Parse request body
    let data;
    try {
      if (!req.body || !req.body.data) {
        throw new Error('Missing "data" field in request body');
      }
      data = req.body.data;
    } catch (parseError) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid JSON or missing "data" field'
      });
    }

    // Validate data is an array
    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: '"data" must be an array'
      });
    }

    // Get user info from environment variables with defaults
    const fullName = process.env.USER_FULL_NAME || 'john doe';
    const dob = process.env.USER_DOB || '17091999';
    const email = process.env.USER_EMAIL || 'john@xyz.com';
    const rollNumber = process.env.USER_ROLL_NUMBER || 'ABCD123';

    // Generate user_id: lowercase fullname with underscores + "_" + dob
    const userId = fullName.toLowerCase().replace(/\s+/g, '_') + '_' + dob;

    // Initialize arrays
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;

    // Process each item in the data array
    for (const item of data) {
      const itemStr = String(item);

      // Check if it's a number (matches ^[+-]?\d+$)
      if (/^[+-]?\d+$/.test(itemStr)) {
        const num = parseInt(itemStr, 10);
        sum += num;
        
        // Store original string in appropriate array based on parity
        if (num % 2 === 0) {
          evenNumbers.push(itemStr);
        } else {
          oddNumbers.push(itemStr);
        }
      }
      // Check if it's alphabet-only (matches ^[A-Za-z]+$)
      else if (/^[A-Za-z]+$/.test(itemStr)) {
        alphabets.push(itemStr.toUpperCase());
      }
      // Everything else is a special character
      else {
        specialCharacters.push(itemStr);
      }
    }

    // Generate concat_string following the exact algorithm
    const concatString = generateConcatString(data);

    // Prepare response
    const response = {
      is_success: true,
      user_id: userId,
      email: email,
      roll_number: rollNumber,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialCharacters,
      sum: String(sum),
      concat_string: concatString
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Generate concat_string following the exact algorithm from the spec
 * @param {Array} data - Original input data array
 * @returns {string} - Generated concat string
 */
function generateConcatString(data) {
  // Step 1: Collect all alphabet-only items in order
  const alphabetItems = [];
  for (const item of data) {
    const itemStr = String(item);
    if (/^[A-Za-z]+$/.test(itemStr)) {
      alphabetItems.push(itemStr);
    }
  }

  if (alphabetItems.length === 0) {
    return '';
  }

  // Step 2: Reverse the order of alphabet entries
  const reversedAlphabetItems = alphabetItems.reverse();

  // Step 3: For each entry, convert to uppercase then reverse characters
  let concatenated = '';
  for (const item of reversedAlphabetItems) {
    const uppercase = item.toUpperCase();
    const reversed = uppercase.split('').reverse().join('');
    concatenated += reversed;
  }

  // Step 4: Apply alternating caps (start with uppercase)
  let result = '';
  for (let i = 0; i < concatenated.length; i++) {
    if (i % 2 === 0) {
      // Even index - uppercase
      result += concatenated[i].toUpperCase();
    } else {
      // Odd index - lowercase
      result += concatenated[i].toLowerCase();
    }
  }

  return result;
}