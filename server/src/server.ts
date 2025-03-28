import express from "express";
import fs from "fs";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import cors from "cors";
import {configPath, materialsPath, selectPath} from "./path/path";
import {ErrorReadFile} from "./lib/errorReadFile";

const app = express();
const PORT = 3001;

// Middleware для парсинга JSON
app.use(express.json());

// Разрешаем все домены (для тестов, в продакшн используйте более строгую настройку)
app.use(cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


// Маршрут для получения данных из JSON файла
app.get("/config", (req, res) => {
    fs.readFile(configPath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({error: "Failed to read config file"});
        }
        res.json(JSON.parse(data));
    });
});

// Маршрут для получения материалов
app.get("/materials", (_, res) => {
    fs.readFile(materialsPath, "utf-8", (err, data) => {
        if (err) {
            ErrorReadFile(res, 'materials')
        }
        res.json(JSON.parse(data));
    });
});

app.get('/select', (_, res) => {
    fs.readFile(selectPath, "utf-8", (err, data) => {
        if (err) {
            ErrorReadFile(res, 'select');
        }
        res.json(JSON.parse(data));
    })
})


// Маршрут для обновления данных в JSON файле
app.post("/config", (req, res) => {
    const updatedConfig = req.body;

    fs.readFile(configPath, "utf-8", (err, data) => {
        if (err) {
            ErrorReadFile(res, 'config');
        }

        const config = JSON.parse(data);

        // Найдите и обновите объект по ключу
        const index = config.findIndex((item: any) => item.key === updatedConfig.key);
        if (index !== -1) {
            config[index] = {
                ...config[index],
                ...updatedConfig,
                value: Number(updatedConfig.value), // Приводим value к числу
                min: updatedConfig.min !== undefined ? Number(updatedConfig.min) : config[index].min,
                max: updatedConfig.max !== undefined ? Number(updatedConfig.max) : config[index].max,
                step: updatedConfig.step !== undefined ? Number(updatedConfig.step) : config[index].step,
            };
        }

        // Записать обновленные данные обратно в файл
        fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                return res.status(500).json({error: "Failed to write to config file"});
            }
            res.json({message: "Config updated successfully"});
        });
    });
});

app.post("/select", (req, res) => {
    const updatedSelectOption = req.body;

    fs.readFile(selectPath, "utf-8", (err, data) => {
        if (err) {
            ErrorReadFile(res, 'select');
        }

        const select = JSON.parse(data);
        Object.assign(select, updatedSelectOption);

        // Записать обновленные данные обратно в файл
        fs.writeFile(selectPath, JSON.stringify(select, null, 2), (err) => {
            if (err) {
                return res.status(500).json({error: "Failed to write to select file"});
            }
            res.json({message: "Select file updated successfully"});
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
