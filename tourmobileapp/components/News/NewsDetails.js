import React from "react"
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from "react-native"
import APIs, { endpoints } from "../../configs/APIs"
import Style from "./Style"
import { Card } from "react-native-paper"
import RenderHTML from "react-native-render-html"

const NewsDetails = ({ route}) => {
    const newsId = route.params?.newsId
    const [news, setNews] = React.useState(null)
    const { width } = useWindowDimensions();

    const loadNews = async () => {
        try {
            let res = await APIs.get(endpoints['news-details'](newsId))
            setNews(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadNews();
    }, [newsId])

    return (
        <View style={[Style.container, Style.margin]}>
            <ScrollView>
                {news===null?<ActivityIndicator/>:<>
                    <Card key={news.id}>
                        <Card.Title titleStyle={Style.title} title={news.title} />
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: news.content}} />
                        </Card.Content>
                        {news.news_image.map(n => <View key={n.id}>
                            <Card.Cover style={Style.margin} source={{uri:n.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{n.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}
            </ScrollView>
        </View>
    )
}

export default NewsDetails;