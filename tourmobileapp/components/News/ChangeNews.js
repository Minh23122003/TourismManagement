import React from "react";
import { View, Text } from "react-native";

const ChangeNews = ({route}) => {
    const [news, setNews] = React.useState(route.params?.news)

    return (
        <View>
            <Text>{news.id}</Text>
        </View>
    )
}

export default ChangeNews;