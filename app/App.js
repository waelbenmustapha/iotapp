import pahoMqtt from "paho-mqtt";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const client = new pahoMqtt.Client(
  "broker.hivemq.com",
  Number(8000),
  `mqtt-random-${parseInt(Math.random() * 100)}`
);

export default function App() {
  const [newTopic, setNewTopic] = useState("");
  const [subscribedTopics, setSubscribedTopics] = useState([
    { name: "hc/temp", messages: [] },
    { name: "hc/freq", messages: [] },
    { name: "hc/steps", messages: [] },
    { name: "hc/o2", messages: [] },
    { name: "hc/pres", messages: [] },
  ]);
  const onMessage = (data) => {
    console.log(subscribedTopics);
    const foundIndex = subscribedTopics.findIndex(
      (x) => x.name == data.destinationName
    );
    console.log(foundIndex);
    if (foundIndex != -1) {
      const cpy = [...subscribedTopics];
      cpy[foundIndex].messages.push({
        value: data.payloadString,
        date: new Date(),
      });
      console.log(cpy);

      setSubscribedTopics(cpy);
    }
  };
  client.onMessageArrived = onMessage;
  useEffect(() => {
    client.connect({
      onSuccess: () => {
        console.log("connected succefully");
        subscribedTopics.forEach((el) => client.subscribe(el.name));
      },
      onFailure: () => {
        console.log("Connection failed");
      },
    });
  }, []);

  const [msg, setMsg] = useState("initial msg");

  return (
    <ScrollView style={{marginTop:StatusBar.currentHeight}}>
      <Text style={{alignSelf:"center"}}>Welcome to my MQTT!</Text>
      <TextInput
        style={{ borderWidth: 1, width: "80%",borderRadius:10,margin:5,alignSelf:"center" }}
        onChangeText={(t) => setNewTopic(t)}
      ></TextInput>
      <TouchableOpacity
        style={{ backgroundColor: "brown", padding: 10 ,marginRight:20,marginLeft:20,borderRadius:10}}
        onPress={() => {
          setSubscribedTopics((current) => [
            ...current,
            { name: newTopic, messages: [] },
          ]);

          client.subscribe(newTopic);
        }}
      >
        <Text style={{color:"white",fontSize:16,textAlign:"center"}}>Subscribe to new topic</Text>
      </TouchableOpacity>
      <View style={{ height: 500 }}>
        <ScrollView
          horizontal
          style={{ display: "flex", flexDirection: "row" }}
        >
          {subscribedTopics.map((el, i) => (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                borderRadius: 10,
                marginRight: 5,
                marginTop: 10,
                marginLeft: 5,
                padding: 10,
              }}
              key={i}
            >
              <Text style={{ color: "red", fontWeight: "500" }}>{el.name}</Text>

              <ScrollView>
                {el.messages.map((data, index) => (
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      borderRadius: 5,
                      backgroundColor: "#efefef",
                      marginTop: 10,
                    }}
                    key={index}
                  >
                    <Text>
                      value :{" "}
                      <Text style={{ fontSize: 17, fontWeight: "700" }}>
                        {data.value}
                      </Text>
                    </Text>
                    <Text>
                      {new Date(data.date).toLocaleDateString() +
                        " " +
                        new Date(data.date).toLocaleTimeString()}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
