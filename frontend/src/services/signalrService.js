import * as signalR from '@microsoft/signalr'

let connection = null

export const startConnection = async (consultationId, onMessage, onPrediction) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5043/hubs/consultation')
    .withAutomaticReconnect()
    .build()

  connection.on('NewMessage', onMessage)
  connection.on('PredictionResult', onPrediction)

  await connection.start()
  await connection.invoke('JoinConsultation', consultationId.toString())
}

export const stopConnection = async () => {
  if (connection) await connection.stop()
}