import fs from "fs"
import { exec } from "child_process";

export const recommend = async (req, res, next) => {
    try {
        const inputData = req.body;
        // Set the path to your Python script that loads the pickle file
        const pythonScriptPath = './load_pickle.py';

        // Set the path to your pickle file
        const pickleFilePath = './hotel.pkl';

        // Build the command to execute the Python script
        const command = `python ${pythonScriptPath} ${pickleFilePath}`;

        // Execute the command and capture the output
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                return;
            }

            // Parse the output JSON from the Python script
            const loadedData = JSON.parse(stdout);

            // Use the loaded data as needed
            console.log(loadedData);
        });






        // if (predictions) {
        //     console.log("got recommendation")
        //     res.status(200).json({
        //         predictions: predictions,
        //         status: true
        //     })
        // } else {
        //     console.log("don't get any recommendation");
        //     res.status(200).json({
        //         predictions: null,
        //         status: false
        //     })

        // }
    } catch (error) {
        next(error)
    }
}


