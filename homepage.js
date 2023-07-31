import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      submitted: false,
      name: "", // For the chat name input
      chats: [], // List of chats
    };
  }

  componentDidMount() {
    this.loadChats();
  }

  loadChats = async () => {
    try {
      const response = await fetch("http://localhost:3333/api/1.0.0/chats", {
        headers: {
          "X-Authorization": await AsyncStorage.getItem(
            "@whatsthat_session_token"
          ),
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        this.setState({ chats: data });
      } else {
        console.error("Failed to load chats:", response.status);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  logout = async () => {
    fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "@whatsthat_session_token"
        ),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem("@whatsthat_session_token");
          await AsyncStorage.removeItem("@whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else if (response.status === 401) {
          console.log("Unauthorized");
          await AsyncStorage.removeItem("@whatsthat_session_token");
          await AsyncStorage.removeItem("@whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        this.setState({ error });
        this.setState({ submitted: false });
      });
  };

  navigateToContacts = () => {
    this.props.navigation.navigate("Contacts");
  };

  startChat = async () => {
    const navigation = this.props.navigation;

    let toSend = {
      name: this.state.name,
    };

    try {
      const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": await AsyncStorage.getItem(
            "@whatsthat_session_token"
          ),
        },
        body: JSON.stringify(toSend),
      });

      if (response.status === 201) {
        const responseJson = await response.json();
        console.log("Chat created with ID:", responseJson.chat_id);

        // Update the chats state with the new chat
        this.setState((prevState) => ({
          chats: [
            ...prevState.chats,
            { id: responseJson.chat_id, name: this.state.name },
          ],
        }));

        return false;
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        console.error("Failed to create chat:", errorResponse.message);
      } else {
        console.error("Failed to create chat:", response.status);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => this.handleChatPress(item.id)}
      >
        <Text style={styles.chatName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  handleChatPress = (chatId) => {
    this.props.navigation.navigate("ChatDetails", { chatId });
  };

  render() {
    const { chats } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Profile")}
        >
          <Text>Profile page</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Contacts")}
        >
          <Text>Contacts</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="New chat"
          onChangeText={(name) => this.setState({ name })}
          value={this.state.name}
        />

        <TouchableOpacity onPress={() => this.startChat()}>
          <Text>Start Chat</Text>
        </TouchableOpacity>

        <FlatList
          data={chats}
          renderItem={this.renderChatItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  loginbtn: {
    marginBottom: 30,
  },
  signup: {
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
  error: {
    color: "red",
    fontWeight: "900",
    marginTop: 10,
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  chatName: {
    fontSize: 18,
  },
});
