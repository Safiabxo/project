import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: " ",
      error: " ",
      submitted: false,
      contacts: [], // Array to store the added contacts
      blockedContacts: [], // Array to store the blocked contacts
    };
  }

  async componentDidMount() {
    try {
      // Load the contacts and blocked contacts from storage
      const contacts = await AsyncStorage.getItem("contacts");
      const blockedContacts = await AsyncStorage.getItem("blockedContacts");
      if (contacts) {
        this.setState({ contacts: JSON.parse(contacts) });
      }
      if (blockedContacts) {
        this.setState({ blockedContacts: JSON.parse(blockedContacts) });
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    // Save the contacts to storage before leaving the page
    const { contacts } = this.state;
    AsyncStorage.setItem("contacts", JSON.stringify(contacts)).catch(
      (error) => {
        console.log(error);
      }
    );
  }

  addContact = async () => {
    try {
      const { user_id, contacts } = this.state;

      // Check if the user_id already exists in contacts
      const existingContact = contacts.find(
        (contact) => contact.user_id === user_id
      );
      if (existingContact) {
        console.error("Contact already exists");
        return;
      }

      let toSend = {
        user_id: user_id,
      };

      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": await AsyncStorage.getItem(
              "@whatsthat_session_token"
            ),
          },
          body: JSON.stringify(toSend),
        }
      );

      if (response.status === 200) {
        // Success: Contact added
        console.log("Contact added successfully");
        // Update the contacts array with the added contact
        const addedContact = {
          user_id: user_id,
        };
        this.setState((prevState) => ({
          contacts: [...prevState.contacts, addedContact],
        }));
        // Save the updated contacts array to storage
        await AsyncStorage.setItem(
          "contacts",
          JSON.stringify(this.state.contacts)
        );
      } else if (response.status === 400) {
        // Bad request: You can't add yourself as a contact
        console.error("You can't add yourself as a contact");
      } else if (response.status === 401) {
        // Unauthorized
        console.error("Unauthorized");
      } else if (response.status === 404) {
        // Not found
        console.error("User not found");
      } else if (response.status === 500) {
        // Server error
        console.error("Server error");
      } else {
        // Handle other status codes here
        console.error("Unhandled status code:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  deleteItem = async (user_id) => {
    try {
      const { contacts } = this.state;

      const toSend = {
        user_id: user_id,
      };

      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": await AsyncStorage.getItem(
              "@whatsthat_session_token"
            ),
          },
          body: JSON.stringify(toSend),
        }
      );

      if (response.status === 200) {
        // Item deleted successfully
        this.setState((prevState) => ({
          contacts: prevState.contacts.filter(
            (contact) => contact.user_id !== user_id
          ),
        }));
        window.alert("Item Deleted");
      } else if (response.status === 401) {
        // Unauthorized
        console.error("Unauthorized");
      } else if (response.status === 404) {
        // Not found
        console.error("Item not found");
      } else if (response.status === 500) {
        // Server error
        console.error("Server error");
      } else {
        // Handle other status codes here
        console.error("Unhandled status code:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  unblockUser = async (user_id) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": await AsyncStorage.getItem(
              "@whatsthat_session_token"
            ),
          },
        }
      );

      if (response.status === 200) {
        // User unblocked successfully
        console.log("User unblocked successfully");

        // Update the state to remove the unblocked contact from blockedContacts and add it back to contacts
        this.setState(
          (prevState) => ({
            blockedContacts: prevState.blockedContacts.filter(
              (contact) => contact.user_id !== user_id
            ),
            contacts: [...prevState.contacts, { user_id }],
          }),
          async () => {
            // Save the updated arrays to storage
            await AsyncStorage.setItem(
              "contacts",
              JSON.stringify(this.state.contacts)
            );
            await AsyncStorage.setItem(
              "blockedContacts",
              JSON.stringify(this.state.blockedContacts)
            );
          }
        );
      } else if (response.status === 400) {
        // Bad request: You can't unblock yourself
        console.error("You can't unblock yourself");
      } else if (response.status === 401) {
        // Unauthorized
        console.error("Unauthorized");
      } else if (response.status === 404) {
        // Not found
        console.error("User not found");
      } else if (response.status === 500) {
        // Server error
        console.error("Server error");
      } else {
        // Handle other status codes here
        console.error("Unhandled status code:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  blockUser = async (user_id) => {
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/block`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": await AsyncStorage.getItem(
              "@whatsthat_session_token"
            ),
          },
        }
      );

      if (response.status === 200) {
        // User blocked successfully
        console.log("User blocked successfully");
        // Remove the blocked contact from the contacts array
        this.setState((prevState) => ({
          contacts: prevState.contacts.filter(
            (contact) => contact.user_id !== user_id
          ),
          blockedContacts: [...prevState.blockedContacts, { user_id }],
        }));

        // Save the updated contacts and blockedContacts arrays to storage
        await AsyncStorage.setItem(
          "contacts",
          JSON.stringify(this.state.contacts)
        );
        await AsyncStorage.setItem(
          "blockedContacts",
          JSON.stringify(this.state.blockedContacts)
        );
      } else if (response.status === 400) {
        // Bad request: You can't block yourself
        console.error("You can't block yourself");
      } else if (response.status === 401) {
        // Unauthorized
        console.error("Unauthorized");
      } else if (response.status === 404) {
        // Not found
        console.error("User not found");
      } else if (response.status === 500) {
        // Server error
        console.error("Server error");
      } else {
        // Handle other status codes here
        console.error("Unhandled status code:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { contacts, blockedContacts } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>User id:</Text>
          <View style={styles.inputtextContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter User id to add"
              onChangeText={(user_id) => this.setState({ user_id })}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={this.addContact}>
          <Text>Add Contact</Text>
        </TouchableOpacity>

        <View style={styles.contactsContainer}>
          <Text style={styles.contactsTitle}>Contacts:</Text>
          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <Text>{contact.user_id}</Text>
              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => this.unblockUser(contact.user_id)}
              >
                <Text>Unblock</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => this.deleteItem(contact.user_id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
              <Button
                title="Block"
                onPress={() => this.blockUser(contact.user_id)}
              />
            </View>
          ))}
        </View>

        <View style={styles.blockedContactsContainer}>
          <Text style={styles.contactsTitle}>Blocked Contacts:</Text>
          {blockedContacts.map((contact, index) => (
            <View key={index} style={styles.contactItem}>
              <Text>{contact.user_id}</Text>
              <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => this.unblockUser(contact.user_id)}
              >
                <Text>Unblock</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  inputContainer: {
    marginBottom: 10,
    width: 50,
  },
  inputtextContainer: {
    width: 150,
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 4,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#6495ED",
    padding: 10,
    borderRadius: 5,
  },
  contactsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  contactsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  blockedContactsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
