import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import pahoMqtt from "paho-mqtt";

const ChatScreen = ({ route }) => {
  const subj = route.params.state.obj;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [client, setClient] = useState(null);
  useEffect(() => {
    const client = new pahoMqtt.Client(
      "broker.hivemq.com",
      Number(8000),
      `mqtt-random-${parseInt(Math.random() * 100)}`
    );
    client.onMessageArrived = (message) => {
      console.log(messages);
      const cpy = [...messages];
      setMessages((prev) => [
        ...prev,
        { text: message.payloadString, isSent: false },
      ]);
    };
    client.connect({ onSuccess: () => client.subscribe(subj.name) });
    setClient(client);
  }, []);

  const handleSend = () => {
    var message;
    message = new pahoMqtt.Message(input);
    message.destinationName = subj.name;
    client.send(message);
    setMessages((prev) => [...prev, { text: input, isSent: true }]);
    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        {subj.name}
      </Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index}>
            {messages[index - 1]?.isSent ? null : (
              <Animated.View
                style={[
                  styles.messageContainer,
                  {
                    backgroundColor:
                      parseInt(message.text) > subj.maxValue && subj.maxValue,
                  },
                  !message.isSent ? styles.receivedMessage : styles.sentMessage,
                ]}
              >
                <Text style={styles.message}>{message.text}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput value={input} onChangeText={setInput} style={styles.input} />
        <TouchableOpacity
          style={{
            backgroundColor: "brown",
            width: 60,
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            borderRadius:5,
            marginRight:5
          }}
          onPress={handleSend}
        >
          <Text style={{color:"white",fontWeight:"bold"}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor:"white"
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "lightblue",
  },
  message: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius:4,
    borderColor: "gray",
    padding: 10,
  },
});

export default ChatScreen;
