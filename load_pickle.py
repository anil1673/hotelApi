import pickle
import json
import sys

def load_pickle_file(file_path):
    with open(file_path, 'rb') as file:
        data = pickle.load(file)
    return data

# Example usage
if __name__ == '__main__':
    pickle_file_path = sys.argv[1]
    loaded_data = load_pickle_file(pickle_file_path)
    # Perform any necessary operations with the loaded data
    # Return the loaded data as JSON or any desired format
    print(json.dumps(loaded_data))


# import pickle
# import json
# import sys

# def load_pickle_file(file_path):
#     with open(file_path, 'rb') as file:
#         data = pickle.load("./hotel.pkl")
#     return data

# # Example usage
# if __name__ == '__main__':
#     pickle_file_path = sys.argv[1]
#     loaded_data = load_pickle_file(pickle_file_path)
#     # Perform any necessary operations with the loaded data
#     # Return the loaded data as JSON or any desired format
#     print(json.dumps(loaded_data))
