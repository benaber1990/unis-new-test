import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import COLORS from "../misc/COLORS";

const socialMediaContent = [
  {
    id: "001",
    user: {
      username: "ConstructionPro123",
      //   avatar: require("./assets/avatar1.jpg"),
    },
    text: "Just completed a major project! #ConstructionLife #BuildingDreams",
    // image: require("./assets/project1.jpg"),
    likes: 56,
    comments: [
      {
        id: 101,
        user: {
          username: "SafetyFirst",
          //   avatar: require("./assets/avatar2.jpg"),
        },
        text: "Great work! Safety is always a priority. ",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "002",
    user: {
      username: "ConcreteMaster",
      //   avatar: require("./assets/avatar3.jpg"),
    },
    text: "Exploring new concrete techniques today. #Innovation #ConstructionTech",
    // image: require("./assets/project2.jpg"),
    likes: 42,
    comments: [
      {
        id: 201,
        user: {
          username: "TechEnthusiast",
          //   avatar: require("./assets/avatar4.jpg"),
        },
        text: "That's amazing! Any insights you can share?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "003",
    user: {
      username: "SteelMaster",
      //   avatar: require("./assets/avatar5.jpg"),
    },
    text: "Welding some steel beams for a robust structure. #WeldingLife #SteelConstruction",
    // image: require("./assets/project3.jpg"),
    likes: 28,
    comments: [
      {
        id: 301,
        user: {
          username: "MetalArtist",
          //   avatar: require("./assets/avatar6.jpg"),
        },
        text: "Love the craftsmanship! How long did it take?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "004",
    user: {
      username: "GreenBuilds",
      //   avatar: require("./assets/avatar7.jpg"),
    },
    text: "Implementing eco-friendly materials in our projects. #SustainableConstruction #GreenBuilding",
    // image: require("./assets/project4.jpg"),
    likes: 35,
    comments: [
      {
        id: 401,
        user: {
          username: "Environmentalist",
          //   avatar: require("./assets/avatar8.jpg"),
        },
        text: "Fantastic initiative! How are you minimizing the carbon footprint?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "005",
    user: {
      username: "ArchitecturePro",
      //   avatar: require("./assets/avatar9.jpg"),
    },
    text: "Collaborating with architects to create stunning designs. #ArchitecturalMarvels #DesignInConstruction",
    // image: require("./assets/project5.jpg"),
    likes: 48,
    comments: [
      {
        id: 501,
        user: {
          username: "DesignEnthusiast",
          //   avatar: require("./assets/avatar10.jpg"),
        },
        text: "The design is breathtaking! Any challenges you faced during the process?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "006",
    user: {
      username: "SafetyInspector",
      //   avatar: require("./assets/avatar11.jpg"),
    },
    text: "Ensuring a safe working environment for everyone.  #SafetyFirst #ConstructionSafety",
    // image: require("./assets/project6.jpg"),
    likes: 30,
    comments: [
      {
        id: 601,
        user: {
          username: "ConcernedWorker",
          //   avatar: require("./assets/avatar12.jpg"),
        },
        text: "Thank you for your dedication to safety! What tips do you have for new workers?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "007",
    user: {
      username: "RoofingExpert",
      //   avatar: require("./assets/avatar13.jpg"),
    },
    text: "Roofing under the clear blue sky. #RoofingLife #SkyHighConstruction",
    // image: require("./assets/project7.jpg"),
    likes: 25,
    comments: [
      {
        id: 701,
        user: {
          username: "CloudWatcher",
          //   avatar: require("./assets/avatar14.jpg"),
        },
        text: "Beautiful view! How do you manage working at heights?",
      },
      // Add more comments as needed
    ],
  },
  {
    id: "008",
    user: {
      username: "ProjectManager",
      //   avatar: require("./assets/avatar15.jpg"),
    },
    text: "Leading the team to success on our latest project. #ProjectManagement #TeamWork",
    // image: require("./assets/project8.jpg"),
    likes: 38,
    comments: [
      {
        id: 801,
        user: {
          username: "TeamPlayer",
          //   avatar: require("./assets/avatar16.jpg"),
        },
        text: "Great leadership! How do you keep the team motivated?",
      },
      // Add more comments as needed
    ],
  },
];

export default function HubAllContent() {
  const Item = ({ user, text, image, likes, comments }) => (
    <View style={styles.itemStyle}>
      <Text
        style={{
          marginBottom: 10,
          color: "white",
        }}
      >
        {user.username}
      </Text>
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        {text}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      user={item.user}
      text={item.text}
      image={item.image}
      likes={item.likes}
      comments={item.comments}
    />
  );

  return (
    <View style={styles.screenStyle}>
{/* Search */}
<View>
    
</View>

      <FlatList
        data={socialMediaContent}
        renderItem={renderItem}
        ListHeaderComponent={() => <View style={{ marginTop: 40 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  itemStyle: {
    marginBottom: 20,
    marginHorizontal: 20,
    backgroundColor: COLORS.grey,
    padding: 20,
    borderRadius: 8,
  },
});
