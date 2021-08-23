import React, { useEffect, useState } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
import AxiosClient from '../services/AxiosClient';
import Links from '../routes/Links';
import { Segment, Container, Header, Icon, Divider, Dimmer, Loader, Form, Button } from 'semantic-ui-react';

import fundo from '../assets/fundo.jpg';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const GraficoSegment = (props) => {

    let [options, setOptions] = useState({});
    // let [medicoes, setMedicoes] = useState([]);

    useEffect(() => {
        if(props.filtro !== undefined){
            carregaValores();
        }
        // carregaValores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filtro]);

    const carregaValores = () => {
        
        props.setLoading(true);
        AxiosClient.post(
            Links.medicoes,
            props.filtro,
            {
                headers: {
                    "Content-type": "Application/json",
                    "Authorization": '60e142711eaf3f50dca37bad'
                }   
            }
        )
        .then(result => {
            console.log(result);
            let medicoesArray = [];
            for (var i = 0; i < result.data.length; i++) {
                let medicao = [];

                let co2 = result.data[i].medicao;
                let timestamp = result.data[i].data;
                let idSensor = result.data[i].idSensor;
                let risco = result.data[i].risco;
                let riscoSemMascara = result.data[i].riscoSemMascara;

                medicao.push(co2);
                medicao.push(timestamp);
                medicao.push(idSensor);
                medicao.push(risco);
                medicao.push(riscoSemMascara);

                medicoesArray.push(medicao);
            }
            // setMedicoes(medicoesArray);

            props.setMedicoes(medicoesArray);

            carregaGrafico(medicoesArray);
        });
    }

    const carregaGrafico = (medicoes) => {
        let dataPoints = [];

        for(let i = 0; i < medicoes.length; i++) {
            let co2 = medicoes[i][0];
            let timestamp = medicoes[i][1];

            let dateRaw = new Date(timestamp);

            let date = dateRaw.getTime();

            dataPoints.push({x: date, y: parseFloat(co2)});
            
        }

        // console.log(dataPoints);

        setOptions({
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            data: [{
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPoints
            }]
        });

        props.setLoading(false);
    }

    return (
        <Segment>
            <Dimmer active={props.loading} inverted>
                <Loader inverted>Carregando</Loader>
            </Dimmer>
            <div>
                <Header as="h2" >
                    <Icon name="area graph" />
                    <Header.Content>Gráfico</Header.Content>
                </Header>
                <Divider />
                <CanvasJSChart options={options}/>
            </div>
        </Segment>
    );
}

const GraficoRiscoSegment = (props) => {

    let [options, setOptions] = useState({});
    // let [medicoes, setMedicoes] = useState([]);

    useEffect(() => {
        if(props.medicoes !== [] && props.medicoes !== undefined){
            carregaGrafico();
        }
        // carregaValores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.medicoes]);

    const carregaGrafico = () => {
        let dataPointsComMascara = [];
        let dataPointsSemMascara = [];

        for(let i = 0; i < props.medicoes.length; i++) {
            let risco = props.medicoes[i][3];
            let riscoSemMascara = props.medicoes[i][4];
            let timestamp = props.medicoes[i][1];

            let dateRaw = new Date(timestamp);

            let date = dateRaw.getTime();

            dataPointsComMascara.push({x: date, y: parseFloat(risco)});
            dataPointsSemMascara.push({x: date, y: parseFloat(riscoSemMascara)});
        }

        // console.log(dataPoints);

        setOptions({
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            zoomEnabled: true,
            data: [{
                name: "Sem máscara",
                showInLegend: true,
                color: "#e57373",
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPointsSemMascara
            }, {
                name: "Com máscara",
                showInLegend: true,
                color: "green",
                type: "area",
                xValueType: "dateTime",
                dataPoints: dataPointsComMascara
            }]
        });

        props.setLoading(false);
    }

    return (
        <Segment>
            <Dimmer active={props.loading} inverted>
                <Loader inverted>Carregando</Loader>
            </Dimmer>
            <div>
                <Header as="h2" >
                    <Icon name="area graph" />
                    <Header.Content>Gráfico do Risco</Header.Content>
                </Header>
                <Divider />
                <CanvasJSChart options={options}/>
            </div>
        </Segment>
    );
}

const FiltrosSegment = (props) => {

    let [sensor, setSensor] = useState('610102bde69bd84020a30f52');
    let [dia, setDia] = useState(0);
    let [ateDia, setAteDia] = useState(0);
    let [mes, setMes] = useState(0);

    let optionsSensores = [
        { key: '610102bde69bd84020a30f52', text: '610102bde69bd84020a30f52', value: '610102bde69bd84020a30f52' },
        { key: '610597435877da09d494531c', text: '610597435877da09d494531c', value: '610597435877da09d494531c' }
    ];

    let optionsMeses = [
        { key: 0, text: '---', value: 0 },
        { key: 6, text: 'Junho', value: 6 },
        { key: 7, text: 'Julho', value: 7 },
        { key: 8, text: 'Agosto', value: 8 }
    ];

    let [optionsDias, setOptionsDias] = useState([]);

    useEffect(() => {
        let diasArray = [{ key: 0, text: "---", value: 0 }];
        let i = 1;
        while(i <= 31) {
            let option = { key: i, text: i, value: i }
            diasArray.push(option);
            i++;
        }
        setOptionsDias(diasArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const enviaFiltro = () => {

        if(mes === 0){
            let filtro = {
                idSensor: sensor
            };

            props.setFiltro(filtro);
        } else {

            let diaAux = dia < 10 ? "0" + dia : dia;
            let ateDiaAux = dia < 10 ? "0" + ateDia : ateDia;
            let mesAux = mes < 10 ? "0" + mes : mes;

            let diaFormatado = "2021-" + mesAux + "-" + diaAux + "T00:00:00.000-03:00";
            let ateDiaFormatado = "2021-" + mesAux + "-" + diaAux + "T23:59:00.000-03:00";

            if(dia === 0) {
                diaFormatado = "2021-" + mesAux + "-01T00:00:00.000-03:00";
                ateDiaFormatado = "2021-" + mesAux + "-31T23:59:00.000-03:00";
            } else {
                if(ateDia !== 0) {
                    ateDiaFormatado = "2021-" + mesAux + "-" + ateDiaAux + "T23:59:00.000-03:00";
                }
            }
            
            let filtro = {
                idSensor: sensor,
                from: diaFormatado,
                to: ateDiaFormatado
            };

            props.setFiltro(filtro);
        }
    }

    return(
        <Segment>
            <Header as="h2">
                <Icon name="filter" />
                <Header.Content>Filtrar medições</Header.Content>
            </Header>
            <Divider />
            <Form>
                <Form.Group widths='equal'>
                    <Form.Select
                        fluid
                        label='Sensor:'
                        options={optionsSensores}
                        value={sensor}
                        onChange={(e, {value}) => setSensor(value)} 
                    />
                    <Form.Select
                        fluid
                        label='Do dia:'
                        options={optionsDias}
                        value={dia}
                        onChange={(e, {value}) => setDia(value)} 
                    />
                        <Form.Select
                        fluid
                        label='Até o dia:'
                        options={optionsDias}
                        value={ateDia}
                        onChange={(e, {value}) => setAteDia(value)} 
                    />
                    <Form.Select
                        fluid
                        label='Mês:'
                        options={optionsMeses}
                        value={mes}
                        onChange={(e, {value}) => setMes(value)} 
                    />
                </Form.Group>
                <Button content='Filtrar' icon='filter' labelPosition='right' onClick={() => enviaFiltro()} loading={props.loading}/>
            </Form>
                
        </Segment>
    );
}

const RiscoSegment = (props) => {

    let [quanta, setQuanta] = useState(25);
    // let [taxaCoIn, setTaxaCoIn] = useState("");
    let [numeroInfectados, setNumeroInfectados] = useState(1);
    let [tempo, setTempo] = useState(2);
    let [ocupantes, setOcupantes] = useState(20);

    const recalculaRiscoDados = (medicoes, numeroInfectados = 1, tempo = 2, ocupantes = 20, quanta = 25) => {
        // props.setLoading(true);

        let medicoesArray = [];

        medicoes.forEach(registro => {
            registro[3] = calculaRisco(registro[0], numeroInfectados, tempo, ocupantes, quanta);
            registro[4] = calculaRisco(registro[0], numeroInfectados, tempo, ocupantes, quanta, false);
            medicoesArray.push(registro);
        });

        props.setMedicoes(medicoesArray);
        // props.setLoading(false);
    }

    //formula da probabilidade derivada de Wells–Riley (RUDNICK; MILTON, 2003),
    const calculaRisco = (taxaCoIn, numeroInfectados, tempo, ocupantes, quanta = 25, temMascara = true) => {
        //passar pra configuração 
        const taxaCoEx = 380;
        const coExalada = 15000;
        const porcOcupantesMask = 1; //todos
        const porcEficienciaMask = 0.5; //mascara de pano

        let quantaExaComMask = temMascara ? getQuantaExaComMask(quanta, porcOcupantesMask, porcEficienciaMask) : quanta; 
        
        let arExaladoAmbiente = (taxaCoIn - taxaCoEx)/coExalada;
        let probabilidade = 1 - Math.exp((-arExaladoAmbiente * numeroInfectados * quantaExaComMask * tempo)/ocupantes);
        // let probabilidade = 1 - Math.exp((-arExaladoAmbiente * numeroInfectados * quanta * tempo)/ocupantes);
        
        return probabilidade*100;
    }

    //taxa de quantaapós vedação e filtração pela máscara (PENG; JIMENEZ, 2020),
    const getQuantaExaComMask = (quanta, porcOcupantesMask, porcEficienciaMask) => {
        return quanta * (1 - porcOcupantesMask * porcEficienciaMask);
    }

    return(
        <Segment>
            <Header as="h2">
                <Icon name="edit" />
                <Header.Content>Calcular Risco</Header.Content>
            </Header>
            <Divider />
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input fluid label='Quanta' value={quanta} onChange={(e, {value}) => setQuanta(value)} />
                    {/* <Form.Input fluid label='Taxa de CO2 interno' value={taxaCoIn} onChange={(e, {value}) => setTaxaCoIn(value)} /> */}
                    
                    <Form.Input fluid label='Numero de infectados' value={numeroInfectados} onChange={(e, {value}) => setNumeroInfectados(value)} />
                    <Form.Input fluid label='Tempo' value={tempo} onChange={(e, {value}) => setTempo(value)} />
                    <Form.Input fluid label='Ocupantes' value={ocupantes} onChange={(e, {value}) => setOcupantes(value)} />
                </Form.Group>
                <Button content='Calcular' icon='arrow right' labelPosition='right' onClick={() => recalculaRiscoDados(props.medicoes, numeroInfectados, tempo, ocupantes, quanta)} loading={props.loading}/>
            </Form>
        </Segment>
    );
}

const HomePage = (props) => {
    
    let [loading, setLoading] = useState(false);

    let [filtro, setFiltro] = useState();
    let [medicoes, setMedicoes] = useState([]);

    return(
        <div style={{background: "url(" + fundo +")"}}>
            <Container>
                <br/>
                <Header as="h1" icon textAlign='center' inverted>
                    <Icon className="icone_dark" name="thermometer half" circular/>
                    <Header.Content>Medidor CO2</Header.Content> 
                </Header>
                <br/>
                <FiltrosSegment 
                    loading={loading}

                    setFiltro={setFiltro}
                />
                <GraficoSegment 
                    loading={loading} setLoading={setLoading} 

                    setMedicoes={setMedicoes}
                    filtro={filtro}
                />
                <GraficoRiscoSegment 
                    loading={loading} setLoading={setLoading} 
                    
                    medicoes={medicoes}
                />
                <RiscoSegment 
                    loading={loading} setLoading={setLoading} 
                    setMedicoes={setMedicoes}
                    medicoes={medicoes}
                    filtro={filtro}
                />
                <br/>
            </Container>
        </div>
    );
}

export default HomePage;