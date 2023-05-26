import moment from "moment/moment";

function scheduleUnbooking() {
    // Run the task every hour
    setInterval(() => {
      const currentTime = moment();
      const newDate=new Date();
      console.log(newDate);
    }, 60 * 60 * 1000); // 1 hour
  }
  