import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import APIs, { endpoints } from "../../configs/APIs";
import Style from "./Style";
import { HelperText, TouchableRipple, Button, TextInput } from "react-native-paper";

const CreateNews = () => {
    const [news, setNews] = React.useState({})
    const [err, setErr] = React.useState(false)
    const [contentErr, setContentErr] = React.useState("")
    const fields = [{
        "label": "tieu de",
        "icon": "text",
        "field": "title"
    }, {
        "label": "noi dung",
        "icon": "text",
        "field": "content"
    }]
    const nav = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change("avatar", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setNews(current => {
            return {...current, [field]:value}
        })
    }

    const Register = async () => {
            setErr(false)
            setLoading(true)
            try {
                let form = new FormData()
                
                            form.append('image',[{uri: news.avatar.uri,
                                name: news.avatar.fileName,
                                type: news.avatar.type}])
                            form.append('name', 'eferfnref')
                console.info(form)
                // console.info(news.avatar.uri)
                // console.info(news.avatar.fileName)
                // console.info(news.avatar.type)
                
                
                let res = await APIs.post(endpoints['test'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(res.status===201)
                    nav.navigate('News')
            }catch (ex) {
                console.error(ex)
            } finally{
                setLoading(false)
            }
    }


    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"}>
            <ScrollView>
                <Text style={Style.text}>Đăng ký người dùng</Text>

                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={news[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} right={<TextInput.Icon icon={f.icon} />} />)}

                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>

                <TouchableRipple style={Style.margin} onPress={picker}>
                    <Text>Chọn ảnh đại diện ...</Text>
                </TouchableRipple>

                {news.avatar && <Image source={{uri: news.avatar.uri}} style={Style.avatar} />}
                <Button icon="account" loading={loading} mode="contained" onPress={Register} >Đăng ký</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default CreateNews;