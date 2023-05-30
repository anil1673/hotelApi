import fs from "fs"
import { exec } from "child_process";
import {PythonShell} from "python-shell"
export const recommend = async (req, res, next) => {
    try {
      
        
// Specify the path to the Python script
const pythonScriptPath = './hotel.pkl';

// Call the Python script
PythonShell.run(pythonScriptPath, null, function (err) {
  if (err) {
    throw err;
  }
  console.log('Pickle file handling complete.');
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


