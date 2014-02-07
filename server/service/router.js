
 var Service	= require('./service.js');
 var console	= require('console-plus');

 var Resurses = [
	{
		host 		: MCServer.Host,
		pathWWW 	: '/',
		source	 	: MCPathes.WWW
	}
//	{
//		host 		: 'localhost',
//		pathWWW 	: '/video/',
//		source	 	: 'e:/video/'
//	}
//	{ 	== пример временной ссылки на файл == 
//		host		: 'localhost',
//		pathWWW		: '/druygh57gerygb54iy7gbv495g9g694gf76gg96eb4tf6ge45g9/',
//		source		: 'e:/anime.xlsx',
//      email       : "gifer@i.ua",
//		TTL			: '7'
//	}
 ];

 var Router = {};

 Router.ParseRequest = function(handle, _path, req, res){
 	var _IDX = -1;
	var maxLen = -1;
	
 	for (var i = 0; i < Resurses.length; i++){
		if (_path.indexOf(Resurses[i].pathWWW) === 0){
			var _curLen = Resurses[i].pathWWW.split('/').length - 1;
			
			if (maxLen < _curLen){
				_IDX = i;
				maxLen = _curLen;
			};
		};
	};
	
	if (_IDX > -1){
		return handle(Resurses[_IDX].source, Service.GetSubstringFrom(_path, Resurses[_IDX].pathWWW), req, res);
	};
 };
 
 Router.AddRoutPath = function(_rout){
 	var Option = Service.Extend({
		host : MCServer.Host,
		pathWWW : '/',
		source : './',
		TTL : ''
	}, _rout || {});
	
	Resurses.push(Option);
	
	return Resurses.length - 1;
 };
 
 Router.AddRandomPath = function(_opt){
 	var Option = Service.Extend({
		host : MCServer.Host,
		pathWWW : '/',
		source : './',
		email : 'support@nsoft-s.com',
		TTL : ''
	}, _opt || {});
	
	Option.pathWWW = '/' + Service.RandomHash(32) + '/mcclient.zip';// + Service.ExtractFileName(Option.source);
	
	// Непостредственная вставка виртуального пути в список Роутер_лист
	Resurses.push(Option);
	
	console.info("Added random path: " + Option.pathWWW + " for file: " + Option.source);
	//console.log("Total pathes: " + JSON.stringify(Resurses));

	return [Resurses.length - 1, Option.pathWWW];
 };
 
 Router.DelRoutPath = function(_idx){
 	Resurses = Resurses.splice(_idx, 1);
 };
 
 Router.LoadPathes = function(){
 };
 
 exports.GO             = Router.ParseRequest;
 exports.AddRandomPath  = Router.AddRandomPath;
 exports.LoadPathes     = Router.LoadPathes;
