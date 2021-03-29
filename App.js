import {
  View,
  Text,
  Alert,
  Modal,
  TextInput,
  StatusBar,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { db } from "./utils/api";
import {
  MaterialIcons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import colors from "./utils/colors";
import { Button } from "react-native-paper";
import React, { useState, useEffect } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Message({ navigation, route }) {
  const [data, setData] = useState();
  const [text, setText] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let message = [];
    db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          message.push({ ...change.doc.data(), id: change.doc.id });
        }
        if (change.type === "modified") {
          let index = message.findIndex((e) => e.id === change.doc.id);
          message[index] = { ...change.doc.data(), id: change.doc.id };
        }
        if (change.type === "removed") {
          message = message.filter((e) => e.id !== change.doc.id);
        }
      });
      message = message.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(message);
    });
  }, []);

  const onSend = async () => {
    setLoading(true);
    let createdAt = Date.now();
    if (text !== "") {
      await db.collection("messages").add({ createdAt, text });
      setLoading(false);
      setText("");
    }
  };

  const deleteMsg = (e) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deletingMsg(e) },
      ]
    );
  };

  const deletingMsg = async (e) => {
    await db.collection("messages").doc(e.id).delete();
  };

  const handleEditMsg = (e) => {
    setData(e);
    setEditMsg(e.text);
    setModalVisible(true);
  };

  const save = async () => {
    setLoading(true);
    await db.collection("messages").doc(data.id).update({ text: editMsg });
    setLoading(false);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} />
      <View style={styles.header}>
        <MaterialIcons name="supervised-user-circle" style={styles.backIcon} />
        <Text style={styles.head}>Messages</Text>
      </View>
      <View style={styles.messages}>
        <ScrollView style={{ flex: 1 }}>
          {!!messages.length &&
            messages.map((e, i) => {
              let time = moment(e.createdAt).format("LT");
              return (
                <View key={i}>
                  <FontAwesome
                    name="trash"
                    style={styles.trash1}
                    onPress={() => deleteMsg(e)}
                  />
                  <FontAwesome
                    name="edit"
                    style={styles.edit1}
                    onPress={() => handleEditMsg(e)}
                  />
                  <View style={styles.myChat}>
                    <Text style={styles.myMsg}>{e.text}</Text>
                    <Text style={styles.myTime}>{time}</Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
      <View style={styles.messageBox}>
        <TextInput
          value={text}
          style={styles.inputTxt}
          placeholder="Type a message..."
          onChangeText={(e) => setText(e)}
        />
        {loading ? (
          <ActivityIndicator
            size={35}
            color={colors.primary}
            style={styles.sendLoad}
          />
        ) : (
          <View style={styles.sendBox}>
            <MaterialCommunityIcons
              onPress={onSend}
              name="send-circle"
              style={styles.send}
            />
          </View>
        )}
      </View>
      <Modal
        transparent={false}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Message!</Text>
            <TextInput
              value={editMsg}
              style={styles.inputMessage}
              placeholder="Edit Message"
              onChangeText={(e) => setEditMsg(e)}
            />
            {loading ? (
              <ActivityIndicator
                color={colors.primary}
                size={20}
                style={styles.lod}
              />
            ) : (
              <>
                <Button
                  mode="contained"
                  style={styles.buttonSave}
                  onPress={save}
                >
                  Save
                </Button>
                <Button
                  mode="contained"
                  style={styles.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  Cancel
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    color: "#EF6268",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    transform: [{ rotate: "180deg" }],
  },
  messageBox: {
    paddingTop: 5,
    paddingBottom: 15,
    borderTopWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    borderTopColor: "silver",
    backgroundColor: "white",
  },
  inputTxt: {
    height: 40,
    width: "85%",
  },
  sendBox: {
    elevation: 1,
    borderRadius: 150,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  send: {
    fontSize: 40,
    color: colors.primary,
  },
  myChat: {
    marginTop: 3,
    marginLeft: 30,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    backgroundColor: "#03a5fc",
    transform: [{ rotate: "180deg" }],
  },
  myMsg: {
    fontSize: 15,
    color: "white",
  },
  myTime: {
    fontSize: 10,
    color: "white",
    alignSelf: "flex-end",
  },
  sendLoad: {
    right: 6,
    elevation: 1,
    borderRadius: 100,
    backgroundColor: "white",
  },
  header: {
    height: 120,
    width: "100%",
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: colors.primary,
  },
  head: {
    fontSize: 20,
    color: "white",
  },
  backIcon: {
    fontSize: 30,
    color: "white",
    marginRight: 10,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  trash1: {
    left: 10,
    bottom: 0,
    fontSize: 20,
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  edit1: {
    left: 8,
    bottom: 20,
    fontSize: 20,
    position: "absolute",
    transform: [{ rotate: "180deg" }],
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    width: "100%",
    marginTop: 10,
    backgroundColor: colors.gray,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  
  inputMessage: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    borderColor: "silver",
  },
  buttonSave: {
    width: "100%",
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  lod: {
    marginTop: 15,
  },
});
