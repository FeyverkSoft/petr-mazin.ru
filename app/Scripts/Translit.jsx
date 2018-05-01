/**
 * Транслит текста
 */
/// Холст 
import React from 'react';
import { Lang } from '../lang.jsx';
import { getObject } from '../Api.jsx';
import { AreaInput, Button, Select, LabeledPre, Toggle, MaterialList, ListItem, Item, Input } from "../Components/InputAndButton.jsx";

export class Translit extends React.Component {

    constructor() {
        super();
        this.state = {
            type: 'gost',
            direction: 'encode',
            text: '',
            result: ''
        };
    }

    getRuArray = (type) => {
        switch (type.toLowerCase()) {
            case 'uri':
                return ['Ё', 'Ж', 'Ц', 'Щ', 'Ч', 'Ш', 'Ъ', 'Ь', 'Э', 'Ю', 'Я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ы', ' ', '\\+', '-', 'ё', 'ж', 'ц', 'щ', 'ч', 'ш', 'ъ', 'ь', 'э', 'ю', 'я', 'а', 'б', 'в', 'г', 'д', 'е', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ы', '\\s', '\\+', '-'];
            default:
                return ['Ё', 'Ж', 'Ц', 'Щ', 'Ч', 'Ш', 'Ъ', 'Ь', 'Э', 'Ю', 'Я', 'А', 'Б', 'В', 'Г', 'Д', 'Е', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ы', 'ё', 'ж', 'ц', 'щ', 'ч', 'ш', 'ъ', 'ь', 'э', 'ю', 'я', 'а', 'б', 'в', 'г', 'д', 'е', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ы'];
        }
    }

    getLatArray = (type) => {
        switch (type.toLowerCase()) {
            case 'uri':
                return ['yo', 'zh', 'c', 'sch', 'ch', 'sh', '', '', 'ye', 'yu', 'ya', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'y', '-', '-plus-', '-', 'yo', 'zh', 'c', 'sch', 'ch', 'sh', '', '', 'ye', 'yu', 'ya', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'y', '-', '-plus-', '-'];
            case 'gost':
                return ['E', 'Zh', 'Ts', 'Shch', 'Ch', 'Sh', 'Ie', '', 'E', 'Iu', 'Ia', 'A', 'B', 'V', 'G', 'D', 'E', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'Kh', 'Y', 'e', 'zh', 'ts', 'shch', 'ch', 'sh', 'ie', '', 'e', 'iu', 'ia', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'kh', 'y'];
            default:
                return ['Jo', 'Zh', 'Ts', 'Sch', 'Ch', 'Sh', '"', "'", '`E', 'Ju', 'Ja', 'A', 'B', 'V', 'G', 'D', 'E', 'Z', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'H', 'Y', 'jo', 'zh', 'ts', 'sch', 'ch', 'sh', '"', '\'', '`e', 'ju', 'ja', 'a', 'b', 'v', 'g', 'd', 'e', 'z', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'y'];
        }
    }

    encode = () => {
        let result = this.state.text;
        let ru = this.getRuArray(this.state.type);
        let lat = this.getLatArray(this.state.type);
        for (let i = 0; i < ru.length; i++) {
            if (lat[i] && lat[i] != '' && ru[i] && ru[i] != '')
                result = result.replace(new RegExp(ru[i], 'g'), lat[i]);
        }
        this.setState({ result: result });
    }

    decode = () => {
        let result = this.state.text;
        let ru = this.getRuArray(this.state.type);
        let lat = this.getLatArray(this.state.type);
        for (let i = 0; i < lat.length; i++) {
            if (lat[i] && lat[i] != '' && ru[i] && ru[i] != ''){
                result = result.replace(new RegExp(lat[i], 'g'), ru[i]);}
        }
        this.setState({ result: result });
    }

    process = () => {
        switch (this.state.direction.toLowerCase()) {
            case 'encode':
                this.encode();
                break;
            case 'decode':
                this.decode();
                break;
        }
    }

    onInputVal = (val, valid, path) => {
        this.setState(getObject(this.state, path, val));
    }

    render() {
        let $this = this;
        return (
            <div className='calc-wrapper'>
                <div className='col-wrapper'>
                    <div className='col-2'>
                        <AreaInput
                            label={'input_text'}
                            onChange={$this.onInputVal}
                            path='text'
                            value={$this.state.text}
                        />
                    </div>
                    <div className='col-2'>
                        <LabeledPre label={Lang('result')}
                            value={$this.state.result} />
                    </div>
                </div>
                <div className='col-wrapper col-center'>
                    <div className='col element-padding'>
                        <Button
                            onClick={$this.process}
                            value={Lang('calc')}
                            className='min-screen-100-width' />
                    </div>
                </div>
                <div className='col-wrapper col-center'>
                    <MaterialList
                        title={'settings'}>
                        <ListItem
                            label={'direction_coding'}
                            description={'direction_coding_description'}
                            className='col-1'
                        >
                            <Select
                                items={[new Item('encode', Lang('encode')), new Item('decode', Lang('decode'))]}
                                value={$this.state.direction}
                                onChange={$this.onInputVal}
                                path='direction'
                            />
                        </ListItem>
                        <ListItem
                            label={'Translit_type'}
                            description={'Translit_type_description'}
                            className='col-1'>
                            <Select
                                items={[new Item('default', Lang('Translit_default')), new Item('gost', Lang('Translit_gost')), new Item('uri', Lang('Translit_uri'))]}
                                value={$this.state.type}
                                onChange={$this.onInputVal}
                                path='type'
                            />
                        </ListItem>
                    </MaterialList>
                </div>
            </div>
        );
    }
}