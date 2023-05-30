import joblib

# Load the pickle file
loaded_data = joblib.load('./hotel.pkl')

# Do something with the loaded data
# ...

# Save the data to a new pickle file
joblib.dump(loaded_data, 'new_pickle_file.pkl')