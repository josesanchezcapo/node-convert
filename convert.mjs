// Importing necessary modules
import fs from 'fs'; // File system module for reading and writing files
import path from 'path'; // Module for working with file and directory paths
import readline from 'readline'; // Module for creating readline interfaces

// Function to convert JSON to CSV
function jsonToCsv(jsonData) {
    const csvRows = []; // Array to store CSV rows
    const headers = Object.keys(jsonData[0]); // Extracting headers from the first object in the JSON data
    csvRows.push(headers.join(',')); // Adding headers as the first row in CSV

    // Iterating over each object in the JSON data
    for (const row of jsonData) {
        // Extracting values corresponding to each header
        const values = headers.map(header => {
            let data = row[header];
            // Wrapping data in double quotes if it contains commas
            if (typeof data === 'string' && data.includes(',')) {
                data = `"${data}"`;
            }
            return data;
        });
        // Joining values with commas and adding as a row in CSV
        csvRows.push(values.join(','));
    }

    // Joining all rows with newline character to form CSV content
    return csvRows.join('\n');
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin, // Standard input stream
    output: process.stdout // Standard output stream
});

// Get the directory name of the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Prompt user for input JSON file name
rl.question('Enter the name of the input JSON file (including extension): ', inputFileName => {
    const inputFilePath = path.resolve(__dirname, inputFileName); // Resolving absolute path of input file

    // Check if input file exists
    fs.access(inputFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Input file does not exist.'); // Log error if input file doesn't exist
            rl.close(); // Close readline interface
            return;
        }

        // Prompt user for output CSV file name
        rl.question('Enter the name of the output CSV file (including extension): ', outputFileName => {
            const outputFilePath = path.resolve(__dirname, outputFileName); // Generating output file path with .csv extension

            // Read input JSON file
            fs.readFile(inputFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading JSON file:', err); // Log error if reading input file fails
                    rl.close(); // Close readline interface
                    return;
                }

                try {
                    // Parse JSON data
                    const jsonData = JSON.parse(data);
                    // Convert JSON data to CSV format
                    const csvData = jsonToCsv(jsonData);
                    // Write CSV data to output file
                    fs.writeFile(outputFilePath, csvData, err => {
                        if (err) {
                            console.error('Error writing CSV file:', err); // Log error if writing output file fails
                            rl.close(); // Close readline interface
                            return;
                        }
                        console.log(`CSV file saved as ${outputFilePath}`); // Log success message
                        rl.close(); // Close readline interface
                    });
                } catch (error) {
                    console.error('Error parsing JSON:', error); // Log error if parsing JSON fails
                    rl.close(); // Close readline interface
                }
            });
        });
    });
});
