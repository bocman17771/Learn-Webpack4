const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//если нам нужен продакшен, то добавляем плагин
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
//если нам нужен продакшен, то добавляем плагин
const TerserWebpackPlugin = require('terser-webpack-plugin')
// {} в скобках подключеются отдельными пакетами
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimiztion = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if(isProd){
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

// функция заменяет статическое написание 
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    }, 
    'css-loader',
    'sass-loader',
  ]
  if(extra){
    loaders.push(extra)
  }
  return loaders
}

const jsLoader = () => {
  const loaders = [{
    loader,
    presets: ['@babel/preset-env']
  }]
  if(isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
},

const plugins = () => {
  const base = [
    // Для динамичнойй передачи файлов в html 
    new HtmlWebpackPlugin({
      // title: 'Тут предаем набор опций, например в title(не работает если указываем template, все статически будет)',
      // указываем данную html на которую основоваемся
      template: './index.html' ,
      // оптимизация
      minify: {
        collapseWhitespace: isProd
      }
    }),
    // Очистка папки dist
    new CleanWebpackPlugin(),
     // Плагин копирования статических файлов(в нашем случаи icon) Тоже не работает(изза версии видимо)
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       // Откуда
    //       from: path.resolve(__dirname, 'src/favicon.ico'),
    //       // Куда копируем
    //       to: path.resolve(__dirname, 'dist')
    //     }
    //   ]
    // }),

    //еще подключаем доп плагин для MiniCssExtractPlugin
    // new MiniCssExtractPlugin({
    //   filename: filename('css)
    // })
  ],

  if(isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}
// Экспортируем объект вебпака
module.exports = {
  // Настройка которая говорит откуда брать исходники(Соответственно в настройках ниже не нужно указывать ./src , но если и указать то не будет работать)
  context: path.resolve(__dirname, 'src'),
  // Указываем в каком режиме(например разработке или продакшен)
  mode: 'development',
  // Тут мы указываем входные файлы для приложения Указывая entry мы говорим откуда стоит начать.
  entry: {
    // в пакетах улучшили , вместо main прописали private(смотреть в пакете). Той строкой мы защищаем себя от случайных публикаций проекта
    main: ['@babel/polyfill', './index.js'],
    // Какой нибудь второстипенный ффайл как аналитика
    analytics: './analytics.js'
  },
  // Куда складываем результат вебпака
  output: {
    // когда все соберет, мы получим ед файл bundle.js || прописали паттерны. name это для отдельности аналитик и майн, а contenthash что бы не кешировалось. Типо динамичность . Все паттерны моэно глянуть в документации
    filename: filename('js'),
    // дальше куда все складываем (path возвращает)
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    // В этом ключе говорим вебпаку какие ключи принимать по умолчанию(если оставить пустым, то нужно прописывать post.js, а не просто post )| Если написали, то это означает, если мы не пишем расширение , то ищи вот это(.js)
    extensions: ['.js', '.json', '.png'],
    // Тут мы указываем элиас путь как во vue, @.
    alias: {
      //указывает на папку model
      '@model': path.resolve(__dirname, 'src/models'),
      // указывает на папку src
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimiztion(),
  // почему то не работает
  devServer: {
    port: 4200,
    hot: isDev
  },
  // Определенные настройки под себя, скорость вложенность и прочее. Можно глянуть в доках
  devTool: isDev ? 'source-map' : '',
  plugins: plugins(),
  // Так как webpack может работать только с js и JSON , но не работает с картинками или стилями с помощью этой настройки мы это исправляем, мы подключаем стили 
  module: {
    rules: [
      {
        //если фалы соответствуют текущему паттерну(как только вебпак в импортах встречает .css), то 
        test: /\.css$/,
        // Нужно использовать различные типы лоадеров||Webpack все пропускает справа на лево || css-loader позволяет понимать подобные импорты, style-loader в данном случае добавляет описанные стили в секцию head в html
        // use: ['style-loader','css-loader'] // изза MiniCssExtractPlugin теперь по другому

        // MiniCssExtractPlugin.loader позволяет css выводить в отдельный файл
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              //позволяет изменять определенные сущности без перезагрузки страниц / сделали что бы только в режиме разработки работал
              hmr: isDev,
              reloadAll: true,
            },
          }, 
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        // То что установили в пакеты
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.less$/,
       
        use: cssLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoader()
      }
    ]
  }
}