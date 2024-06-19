import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import APIs, { endpoints } from "../../configs/APIs";
import Style from "./Style";
import { HelperText, TouchableRipple, Button, TextInput, RadioButton } from "react-native-paper";
import { MyUserContext, NewsDispatchContext } from '../../configs/Contexts'

const CreateNews = () => {
    const [news, setNews] = React.useState({})
    const [err, setErr] = React.useState(false)
    const [contentErr, setContentErr] = React.useState("")
    const [categories, setCategories] = React.useState([])
    const [cateId, setCateId] = React.useState()
    const [nameImage, setNameImage] = React.useState("")
    const user = useContext(MyUserContext)
    const newsDispatch = useContext(NewsDispatchContext)
    const fields = [{
        "label": "Tựa đề",
        "field": "title"
    }, {
        "label": "Nội dung",
        "field": "content"
    }]
    const nav = useNavigation();
    const [loading, setLoading] = React.useState(false)

    const loadCategories = async ()=> {
        try {
            let res = await APIs.get(endpoints["cateNews"]);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(()=> {
        loadCategories();
    }, [])

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted')
            Alert.alert("TourMobileApp", "Permissions Denied!")
        else {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change("image", res.assets[0])
            }
        }
    }

    const change = (field, value) => {
        setNews(current => {
            return {...current, [field]:value}
        })
    }

    const Create = async () => {
        if(news.title===''){
            setErr(true)
            setContentErr("Bạn chưa nhập tiêu đề!")
        } else if(news.content===''){
            setErr(true)
            setContentErr("Bạn chưa nhập nội dung!")
        } else if (nameImage===""){
            setErr(true)
            setContentErr("Bạn chưa nhập tên hình ảnh!")
        } else if(cateId===null){
            setErr(true)
            setContentErr("Bạn chưa chọn loại tin tức!")
        } else {
            setErr(false)
            setLoading(true)
            let uriArray = news.image.uri.split(".");
            let fileExtension = uriArray[uriArray.length - 1];
            let fileTypeExtended = `${news.image.type}/${fileExtension}`;
            try {
                let form = new FormData()   
                    form.append('image',{
                        uri: news.image.uri,
                        name: news.image.fileName,
                        type: fileTypeExtended
                    })
                    form.append('name', nameImage)
                console.info(form)
                
                let res = await APIs.post(endpoints['addNewsImage'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                let res1 = await APIs.post(endpoints['addNews'], {
                    'content':news.content,
                    'title':news.title,
                    'admin_id':user.id,
                    'cate_id':cateId,
                    'newsimage_id':res.data.id
                })
                console.info(res.data)
                if(res1.status===201){
                    newsDispatch({
                        'type': "add"
                    })
                    nav.navigate('News')
                }
            }catch (ex) {
                console.error(ex)
            } finally{
                setLoading(false)
            }
        }
    }


    return (
        <View style={[Style.container, Style.margin]}>
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':"height"}>
            <ScrollView>
                <Text style={Style.text}>Tạo tin tức mới</Text>

                {fields.map(f => <TextInput secureTextEntry={f.secureTextEntry} value={news[f.field]} onChangeText={t => change(f.field, t)} style={Style.margin} key={f.field} label={f.label} multiline={true} />)}

                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>

                <View style={[Style.margin, Style.container]}>
                    <TouchableRipple style={Style.margin} onPress={picker}>
                        <Text>Chọn ảnh ...</Text>
                    </TouchableRipple>
                    {news.image && <Image source={{uri: news.image.uri}} style={Style.avatar} />}
                    <TextInput onChangeText={setNameImage} style={Style.margin} multiline={true} placeholder="Nhập tên hình ảnh" />
                </View>

                <Text>Chọn loại tin tức</Text>
                <RadioButton.Group onValueChange={value => setCateId(value)} >
                    {categories.map(c => <RadioButton.Item key={c.id} status={cateId===c.id?"checked":"unchecked"} label={c.name} value={c.id} />)}
                </RadioButton.Group>

                <HelperText style={[Style.margin, {color:"red"}]} type="error" visible={err}>{contentErr}</HelperText>

                <Button loading={loading} mode="contained" onPress={Create} >Tạo</Button>
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default CreateNews;