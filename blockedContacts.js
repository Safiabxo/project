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
  render() {
    const { contacts } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text>User id:</Text>
          <View style={styles.inputtextContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter User id to unblock"
              onChangeText={(user_id) => this.setState({ user_id })}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={this.addContact}>
          <Text>unblock Contact</Text>
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
            </View>
          ))}
        </View>
      </View>
    );
  }
}
