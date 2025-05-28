var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')
var logresRouter = require('./routes/logres').router;
var masterRouter = require('./routes/master');
const kendaraanRouter = require('./routes/data_kendaraan');
const kendaraan_userRouter = require('./routes/kendaraan_user');
const kategoriKendaraanRouter = require('./routes/kategori_kendaraan');
const supirRoutes = require('./routes/supir');
const jadwal_operasional_kendaraanRouter = require('./routes/jadwal_operasional_kendaraan');
const pemesananRouter = require('./routes/pemesanan');
const log_aktivitasRouter = require('./routes/log_aktivitas');
const jadwal_operasionalRouter = require('./routes/jadwal_operasional');
const edukasiRouter = require('./routes/edukasi');
const ulasanRouter = require('./routes/ulasan');
const notifikasiRouter = require('./routes/notifikasi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(session({
  secret: 'paainur',       
  resave: false,
  saveUninitialized: false,
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', logresRouter);
app.use('/master', masterRouter);
app.use('/data_kendaraan', kendaraanRouter);
app.use('/kendaraan_user', kendaraan_userRouter);
app.use('/kategori_kendaraan', kategoriKendaraanRouter);
app.use('/supir', supirRoutes);
app.use('/jadwal_operasional_kendaraan', jadwal_operasional_kendaraanRouter);
app.use('/pemesanan', pemesananRouter);
app.use('/log_aktivitas', log_aktivitasRouter);
app.use('/jadwal_operasional', jadwal_operasionalRouter);
app.use('/edukasi', edukasiRouter)
app.use('/ulasan', ulasanRouter);
app.use('/notifikasi', notifikasiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;