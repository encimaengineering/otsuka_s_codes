/*! SiteCatalyst code version: H.26.2.
Copyright 1996-2014 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com
Last updated 12/12/2014 by Carl Wall
*/

//ORDER: 2 - config vars are defined

// bt_domainQA is comma-sparated, and QA domain may be a subdomain of the prod domain.
// So, check if the current domain matches the prod domain and then make sure it doesn't also match a QA domain.
var qaDomains = bt_domainQA.split(',');
var scReport=location.hostname+'/hcp';
if (scReport.match(bt_domainProd)){
    var s_account = bt_rsidProd;
    for (var i = 0; i < qaDomains.length; i++){
        if (qaDomains[i]==location.hostname){
            console.log(qaDomains[i]);
            console.log(document.location.hostname+'tester');
            s_account = bt_rsidQA;
        }
    }
    var s=s_gi(s_account);
    if (s_account == bt_rsidQA)
        s.cookieDomain = bt_domainQA.match(location.hostname)[0];
    else
        s.cookieDomain    = bt_domainProd;
}
else {
	var s_account = bt_rsidQA;
	var s=s_gi(s_account);
	s.cookieDomain = bt_domainQA.match(location.hostname)[0];
}
s.cookiePath		= bt_cookiePath ? bt_cookiePath : "/";


/********** CONFIG SECTION **********/

// Note: "bt_" variables are set in BrightTag: http://control.thebrighttag.com/

// General config
s.trackingServer		= bt_trackingServer;
s.trackingServerSecure	= bt_trackingServerSecure != "" ? bt_trackingServerSecure : bt_trackingServer;
s.visitorNamespace		= !bt_trackingServer ? s_account : null; // Set to report suite when not using a custom tracking server
s.cookieDomainPeriods	= !!bt_cookieDomainPeriods ? bt_cookieDomainPeriods : null;
s.charSet				= "ISO-8859-1";
s.currencyCode			= "USD";
s.debugTracking			= false;
s.usePlugins			= true;
s.trackDownloadLinks	= false;
s.trackExternalLinks	= false;
s.trackInlineStats		= false; // Enables ClickMap
s.linkLeaveQueryString	= false;
s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
s.linkInternalFilters	= typeof(bt_linkInternalFilters) != "undefined" ? bt_linkInternalFilters : "";
s.linkTrackVars			= "None";
s.linkTrackEvents		= "None";
// DFA config
var dfa_CSID			= bt_dfa_CSID;
var dfa_SPOTID			= bt_dfa_SPOTID; // DFA Spotlight ID
var dfa_tEvar			= 'eVar10'; // transfer variable, typically the "View Through" eVar.
var dfa_errorEvar		= 'eVar12'; // DFA error tracking (optional)
var dfa_timeoutEvent	= 'event23'; // Tracks timeouts/empty responses (optional)
var dfa_requestURL		= "http://fls.doubleclick.net/json?spot=[SPOTID]&src=[CSID]&var=[VAR]&host=integrate.112.2o7.net%2Fdfa_echo%3Fvar%3D[VAR]%26AQE%3D1%26A2S%3D1&ord=[RAND]"; // the DFA request URL
var dfa_visitCookie		= "s_dfa"; // The name of the visitor cookie to use to restrict DFA calls to once per visit.
var dfa_overrideParam	= "adid"; // A query string paramter that will force the DFA call to occur.
var dfa_newRsidsProp; //= "prop34"; // Stores the new report suites that need the DFA tracking code. (optional)
s.maxDelay				= "2000" // maximum time to wait for DFA, in milliseconds
// TimeParting config
s.DSTDates=[];
s.DSTDates["2014"]		= ["03/09/2014","11/02/2014"];
s.DSTDates["2015"]		= ["03/08/2015","11/01/2015"];
s.DSTDates["2016"]		= ["03/13/2013","11/06/2013"];
s.DSTDates["2017"]		= ["03/12/2013","11/05/2013"];
s.DSTDates["2018"]		= ["03/11/2013","11/04/2013"];
s.DSTDates["2019"]		= ["03/10/2013","11/03/2013"];
s.currentYear			= new Date();
s.currentYear			= s.currentYear.getFullYear();
if (typeof(s.DSTDates[s.currentYear]) != "undefined"){
	s.dstStart			= s.DSTDates[s.currentYear][0]; // Daylight Savings Time start date for the current year.
	s.dstEnd			= s.DSTDates[s.currentYear][1]; // Daylight Savings Time end date for the current year.
}
else {
	console.log('s.currentYear = ' + s.currentYear + '. SiteCatalyst TimeParting config needs to be updated in s_code.js');
}

// Set screen size variables
s.prop24				= bt_screenSize;
s.eVar24				= "D=c24"


var pageUrl = window.document.location.hostname + window.document.location.pathname;
pageUrl = pageUrl.toLowerCase().replace('www.', '');
var omVisitorId = "";
var omVisitorId = getCookie('s_vi');
var isWebsiteBrowsing = false;
var isClickThrough = false;
var isForm = false;
var isConfirmation = false;
var isCampaignEntryPage = false;
var isErrorPage = false;
var mediaChannel = "";
var urlData = {};
var linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
var isViewThrough = false;
var isClickPast = false;
var url = typeof (document.referrer) != 'undefined' ? window.location + document.referrer : window.location; // filter out refreshes based on url + referrer url
var isDFA = false;
var isSEO = false;
s.formName = typeof bt_formName != "undefined" ? bt_formName : ''; // form name set in BrightTag
formName = typeof (formName) != 'undefined' ? formName : ''; // form name set by site developer on page
s.fieldValues = typeof bt_fieldValues != "undefined" ? bt_fieldValues : '';

s.internalDomains = s.linkInternalFilters.split(',');
// Sort s.internalDomains from lengest values to shortest so addabilify.com matches before abilify.com
s.internalDomains.sort(function(a, b){
  return b.length - a.length;
});
if (document.referrer) {
	isClickThrough = true;
	s.referrer = document.referrer;
	s.referrerDomain = getHostname(document.referrer);
	if (s.referrerDomain != location.host){
		// Check to see if the referrer belongs to Otsuka
		for (var i = 0; i < s.internalDomains.length; i++){
			if (s.referrerDomain.indexOf(s.internalDomains[i]) > -1){
				isWebsiteBrowsing = true;
				isClickThrough = false;
				s.eVar3 = s.referrerDomain; // Internal site referral
				break;
			}
		}
		if (!isWebsiteBrowsing){
			// Set last-touch referrer variables
			s.prop37 = s.referrerDomain;
			s.eVar37 = "D=c37";
			s.prop38 = s.referrer;
			s.eVar38 = "D=c38";
		}
	}
	else {
		// Same site
		isClickThrough = false;
	}
}


//ORDER:
// s_doPlugins runs everytime s.t or s.tl is called, and every time a clicked occurs within the window

function s_doPlugins(s) {
	/*** For Link Tracking Calls ***/
	if (!!s.linkType){
		/*
		// Include content description props
		prop1	Site
		channel	Site > Vertical
		prop2	Site > Vertical > Section 
		prop3	Site > Vertical > Section > Category
		prop4	Previous Page
		prop14	PageName
		// Include visitor behaviour props
		prop6	Visit Number
		prop7	Days Since Last Visit
		prop8	Time Parting Hour
		prop9	Time Parting Day
		prop10	Pages Views (Visit)
		prop11	Pages Views (Lifetime)
		// Include user type props
		prop12	New/Repeat Visitor
		prop13	User Type
		// Include visit path props
		prop41	Page URL
		prop42	Internal & External Referring URLs
		*/
		if (s.linkTrackVars=="None")
			s.linkTrackVars = "channel,prop1,prop2,prop3,prop4,prop6,prop7,prop8,prop9,prop10,prop11,prop12,prop13,prop14,prop41,prop42";
		else
			s.linkTrackVars += ",channel,prop1,prop2,prop3,prop4,prop6,prop7,prop8,prop9,prop10,prop11,prop12,prop13,prop14,prop41,prop42";
	}

	/*** For All Calls ***/
	// Set visitor behaviour props
	s.prop8 = s.getTimeParting('h', '-6');
	s.prop9 = s.getTimeParting('d', '-6');

	/*Percent Page Viewed*/
	if(s.prop4){s.prop44=s.getPercentPageViewed();}

	 /* Plugin Example: setupLinkTrack 2.0.2*/
		if(s.contextData['formLink']=="slt"){
			console.log(s.contextData['formLink']);
}

	else {
		s.hbx_lt = "auto" // manual, auto
		s.setupLinkTrack(",,prop51,prop52","SC_LINKS");
        s.eVar51="D=c51";
        s.eVar52="D=c52";
	 }

	//TODO: Update: All details go into one variable, then classifications break the details apart into reports
	//Get classifications spreadsheet from here: http://webanalyticsland.com/sitecatalyst-implementation/tag/day-parting
	//s.prop8 = s.getTimeParting('d','-6') + "|" + s.getTimeParting('h','-6');
	//Set eVar once per visit? Is this eVar "Visit Start Time Parting"? Or, set it on each page with page view expiration?
	//if (s.visEvent) s.eVarXX=s.prop8;
	s.prop12=s.eVar35=s.getNewRepeat(30,'s_gnr');
	/* Shire-only for now
	// Set "Non-Bounce" event in any type of call immediately following the first page view.
	if (s.visitPageNum == 1 && !!s.linkType){
		s.linkTrackVars = s.apl(s.linkTrackVars,"events",',',1);
		s.linkTrackEvents = s.apl(s.linkTrackEvents,"event38",',',1);
		s.events = s.apl(s.events,"event38",',',1);
	}
	else if (s.visitPageNum == 2){
		s.events = s.apl(s.events,"event38",',',1);
	}
	*/
	// Set visit path variables
	s.prop14 = s.pageName;	//TODO: Also put pagename into an eVar
	s.eVar46 = s.pageName;
	s.prop41 = window.location.toString();
	s.eVar47 = window.location.toString();
	s.prop42 = typeof (document.referrer) != 'undefined' ? document.referrer.toLowerCase() : '';

	// WebHue Module for Adobe Analytics - User Type v1
	// Note: BT "Update User Status" event gets called when intro splitter is clicked or when one of three user type radio buttons is submitted to start reg form
	// It drops the wh_userType cookie and sets the wh_userType JavaScript variable
	s.prop13 = !!s.prop13 ? s.prop13 : (!!wh_userType && wh_userType != s.c_r('wh_userType')) ? wh_userType : s.c_r('wh_userType');
	// Development agencies have a bookmarklet that drops the "wh_agent" cookie set to "true".
	if (!!s.prop13 && s.prop13.indexOf('[agency traffic]') == -1 && !!getCookie('wh_agent'))
		s.prop13 += " [agency traffic]";
	// Copy prop13 into eVar2
	if (!!s.prop13)
		s.eVar2 = "D=c13";
}
s.doPlugins=s_doPlugins;



//ORDER: 1 - plugin functions defined in memory

/*************** PLUGINS ***********************/
/*
 * Plugin: getPreviousValue_v1.0 - return previous value of designated variable
 * Requires: s.split
 *
 * s.propX=s.getPreviousValue(V,c,e);
 *   V = The variable to be captured from the previous page (such as s.pageName)
 *   c = The cookie name for storing the value for retrieval (such as "s_gpv_pn")
 *   e = The events that must be set to trigger the retrieval of the previous value.
 *       When omitted the plug-in captures the previous value on all page views.
 */
s.getPreviousValue = new Function("v", "c", "el", "" + "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el" + "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i" + "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)" + ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?" + "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
/*
* Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
 *
 * s.propX=s.getNewRepeat(ce,cn);
 *   ce = Cookie Expiration in days. Defautls to 30 days.
 *   cn = Cookie Name. Defaults to 's_nr'.
 */
s.getNewRepeat=new Function("d","cn",""+"var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"+"'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="+"=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"+"-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"+"ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");
/*
 * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
 */
s.split = new Function("l", "d", "" + "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" + "++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
/*
 * Plugin Utility: s.join: 1.0 
 */
s.join = new Function("v","p","var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back:'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0;x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);else str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
/*
 * Plugin Utility: Replace v1.0
 */
s.repl = new Function("x", "o", "n", "" + "var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x.substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*
 * Plug-in: crossVisitParticipation v1.7 - stacks values in cookie and returns the stack as a string
 * Requires: s.repl
 *
 * s.eVarY=s.crossVisitParticipation(V,c,ce,n,d,ev,s)
 *   V = The variable or string value to add to the stack
 *   c = The cookie name for storing the stack (such as "s_v65" for stacking eVar65 values)
 *   ce = The cookie expiration in days (such as "30")
 *   n = Number of values to keep in the stack. First in, first out.
 *   d = Delimiter for the stack
 *   ev = An event that triggers clearing the list (such as "event2").
 *   s = Whether sequential duplicates should be stacked.
 *       1 = Allow sequential duplicates
 *       Omitted = Do not store sequential duplicates (this is the default)
 */
s.crossVisitParticipation = new Function("v","cn","ex","ct","dl","ev","dv","var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.length;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}if(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape(v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array();if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length;q++){z=arry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\",'');"
+"arry[q]=s.split(z,',')}}var e=new Date();e.setFullYear(e.getFullYear()+5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[arry.length-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new Date().getTime()];var start=arry.length-ct<0?0:arry.length-ct;var td=new Date();for(var x=start;x<arry.length;x++){var diff=Math.round((td.getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arry[x][0]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{delim:',',front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join(h,{delim:dl});if(ce)s.c_w(cn,'');return r;");

/*
 * Plugin: Visit Number By Month 2.0 - Return the user visit number
 */
s.getVisitNum = new Function("" + "var s=this,e=new Date(),cval,cvisit,ct=e.getTime(),c='s_vnum',c2='s" + "_invisit';e.setTime(ct+30*24*60*60*1000);cval=s.c_r(c);if(cval){var" + " i=cval.indexOf('&vn='),str=cval.substring(i+4,cval.length),k;}cvis" + "it=s.c_r(c2);if(cvisit){if(str){e.setTime(ct+30*60*1000);s.c_w(c2,'" + "true',e);return str;}else return 'unknown visit number';}else{if(st" + "r){str++;k=cval.substring(0,i);e.setTime(k);s.c_w(c,k+'&vn='+str,e)" + ";e.setTime(ct+30*60*1000);s.c_w(c2,'true',e);return str;}else{s.c_w" + "(c,ct+30*24*60*60*1000+'&vn=1',e);e.setTime(ct+30*60*1000);s.c_w(c2" + ",'true',e);return 1;}}");

/*
 * Plugin: Days since last Visit 1.1 - capture time from last visit
 */
s.getDaysSinceLastVisit = new Function("c", "" + "var s=this,e=new Date(),es=new Date(),cval,cval_s,cval_ss,ct=e.getT" + "ime(),day=24*60*60*1000,f1,f2,f3,f4,f5;e.setTime(ct+3*365*day);es.s" + "etTime(ct+30*60*1000);f0='Cookies Not Supported';f1='First Visit';f" + "2='More than 30 days';f3='More than 7 days';f4='Less than 7 days';f" + "5='Less than 1 day';cval=s.c_r(c);if(cval.length==0){s.c_w(c,ct,e);" + "s.c_w(c+'_s',f1,es);}else{var d=ct-cval;if(d>30*60*1000){if(d>30*da" + "y){s.c_w(c,ct,e);s.c_w(c+'_s',f2,es);}else if(d<30*day+1 && d>7*day" + "){s.c_w(c,ct,e);s.c_w(c+'_s',f3,es);}else if(d<7*day+1 && d>day){s." + "c_w(c,ct,e);s.c_w(c+'_s',f4,es);}else if(d<day+1){s.c_w(c,ct,e);s.c" + "_w(c+'_s',f5,es);}}else{s.c_w(c,ct,e);cval_ss=s.c_r(c+'_s');s.c_w(c" + "+'_s',cval_ss,es);}}cval_s=s.c_r(c+'_s');if(cval_s.length==0) retur" + "n f0;else if(cval_s!=f1&&cval_s!=f2&&cval_s!=f3&&cval_s!=f4&&cval_s" + "!=f5) return '';else return cval_s;");

/*
 * Plugin: getTimeParting 2.0 - Set timeparting values based on time zone
 */
s.getTimeParting = new Function("t", "z", "" + "var s=this,cy;dc=new Date('1/1/2000');" + "if(dc.getDay()!=6||dc.getMonth()!=0){return'Data Not Available'}" + "else{;z=parseFloat(z);var dsts=new Date(s.dstStart);" + "var dste=new Date(s.dstEnd);fl=dste;cd=new Date();if(cd>dsts&&cd<fl)" + "{z=z+1}else{z=z};utc=cd.getTime()+(cd.getTimezoneOffset()*60000);" + "tz=new Date(utc + (3600000*z));thisy=tz.getFullYear();" + "var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'," + "'Saturday'];if(thisy!=s.currentYear){return'Data Not Available'}else{;" + "thish=tz.getHours();thismin=tz.getMinutes();thisd=tz.getDay();" + "var dow=days[thisd];var ap='AM';var dt='Weekday';var mint='00';" + "if(thismin>30){mint='30'}if(thish>=12){ap='PM';thish=thish-12};" + "if (thish==0){thish=12};if(thisd==6||thisd==0){dt='Weekend'};" + "var timestring=thish+':'+mint+ap;if(t=='h'){return timestring}" + "if(t=='d'){return dow};if(t=='w'){return dt}}};");

/*
 * Plugin: linkHandler 0.5 - identify and report custom links
 */
s.linkHandler = new Function("p", "t", "" + "var s=this,h=s.p_gh(),i,l;t=t?t:'o';if(!h||(s.linkType&&(h||s.linkN" + "ame)))return '';i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h." + "substring(0,i);l=s.pt(p,'|','p_gn',h.toLowerCase());if(l){s.linkNam" + "e=l=='[['?'':l;s.linkType=t;return h;}return '';");

/*
 * Plugin: getValOnce_v1.0
 */
s.getValOnce = new Function("v", "c", "e", "" + "var s=this,a=new Date,v=v?v:v='',c=c?c:c='s_gvo',e=e?e:0,k=s.c_r(c" + ");if(v){a.setTime(a.getTime()+e*86400000);s.c_w(c,v,e?a:0);}return" + " v==k?'':v");

/*
 * Plugin: getQueryParam 2.3
 * Requires: s.p_gpv, s.p_gvf
 *
 * s.getQueryParam(p,d,u)
 *   p = Comma-separated list of query parameters to locate. Can also be a single value with no comma.
 *   d = Delimiter for list of values (in case more than one specified parameter is found).
 *   u = Where to search for value (e.g., document.referrer). Set to current page URL by default.
 */
s.getQueryParam = new Function("p", "d", "u", "" + "var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati" + "on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p" + ".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-" + "1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i=" + "=p.length?i:i+1)}return v");
s.p_gpv = new Function("k", "u", "" + "var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v" + "=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf = new Function("t", "k", "" + "if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T" + "rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s." + "epa(v)}return ''");

//TODO: Why is this located here?
// FICO and Appature Tracking Codes
s.eVar18 = s.getQueryParam('tc');
s.eVar6  = s.getQueryParam('ceid');  // Otsuka-only
s.eVar36 = s.getQueryParam('appid'); // Otsuka-only

/*
 * channelManager v2.83 - Tracking External Traffic
 * Requires: s.split, s.repl, s.getQueryParam, s.getValOnce
 *
 * s.channelManager(cc,d,ccn,u,tbcn,tbo,spn)
 *   cc   = Comma-separated list of query parameters to treat as campaign codes. Can also be a single value with no comma.
 *   d    = Delimiter for list of values to combine into one s._campaign string (in case more than one campaign code is found).
 *   ccn  = Channel cookie name. If omitted, cookie name defaults to "c_m".
 *   u    = Uncompress search engine list. 1 = uncompress, omit if not using a compressed list.
 *   tbcn = Typed/Bookmarked cookie name. If omitted, Typed/Bookmarked is not reported.
 *   tbo  = Typed/Bookmarked should not overwrite other channels
 *         1 = Do not overwrite other channels
 *         Omit = overwrite
 *   spn  = Suppress Paid and Natural Search channels
 *         1 = Suppress
 *         Omit = Allow
 *
 * Channel Manager Configuration:
 *   s._extraSearchEngines="domain.com|keyword param|channel name"  // "live.com|q|Microsoft Bing>google.ws|q|Google"
 *   s._channelDomain="channel name|domain1.com,domain2.com" // "Social Media|facebook.com,twitter.com,reddit.com"
 *   s._channelParameter="channel name|URL param"  // "Search|cmpid>Display|disid>Email|emlid"
 *   s._channelPattern="channel name|campaign code prefix"  // "Email Campaign|EMC>Banner Ad Campaign|BAC"
 */
s.channelManager=new Function("a","b","c","d","e","f","g","var s=this,h=new Date,i=0,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S;h.setTime(h.getTime()+1800000);if(e){i=1;if(s.c_r(e))i=0;if(!s.c_w(e,1,h))s.c_w(e,1,0);if(!s.c_r(e))i=0;if(f&&s.c_r('s_tbm'+f))i=0;}j=s.referrer?s.referrer:document.referrer;j=unescape(j.toLowerCase());if(!j)k=1;else {l=j.indexOf('?')>-1?j.indexOf('?'):j.length;m=j.substring(0,l);n=s.split(j,'/');n=s.split(n[2],'?');o=n[0].toLowerCase();p=s.linkInternalFilters.toLowerCase();p=s.split(p,',');for(q=0;q<p.length;q++){r=o.indexOf(p[q])==-1?'':j;"
+"if(r)break;}}if(!r&&!k){t=j;u=v=o;w='Other Natural Referrers';x=s.seList+'>'+s._extraSearchEngines;if(d==1){m=s.repl(m,'oogle','%');m=s.repl(m,'ahoo','^');j=s.repl(j,'as_q','*');}y=s.split(x,'>');for(z=0;z<y.length;z++){A=y[z];A=s.split(A,'|');B=s.split(A[0],',');for(C=0;C<B.length;C++){D=m.indexOf(B[C]);if(D>-1){if(A[2])E=v=A[2];else E=o;if(d==1){E=s.repl(E,'#',' - ');j=s.repl(j,'*','as_q');E=s.repl(E,'^','ahoo');E=s.repl(E,'%','oogle');}F=s.split(A[1],',');for(G=0;G<F.length;G++){if(j.indexOf(F[G]+'=')>-1||j.indexOf('https://www.google.')==0)H=1;I=s.getQueryParam(F[G],'',j).toLowerCase();"
+"if(H||I)break;}}if(H||I)break;}if(H||I)break;}}if(!r||g!='1'){r=s.getQueryParam(a,b);if(r){v=r;if(E)w='Paid Search';else w='Unknown Paid Channel';}if(!r&&E&&H){v=E;w='Natural Search';}}if(k==1&&!r&&i==1)t=u=v=w='Typed/Bookmarked';J=s._channelDomain;if(J&&o){K=s.split(J,'>');for(L=0;L<K.length;L++){M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++){Q=N[P].toLowerCase();R=o.indexOf(Q);if(R>-1){w=M[0];break;}}if(R>-1)break;}}J=s._channelParameter;if(J){K=s.split(J,'>');for(L=0;L<K.length;L++){M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++){R=s.getQueryParam(N[P]);"
+"if(R){w=M[0];break;}}if(R)break;}}J=s._channelPattern;if(J){K=s.split(J,'>');for(L=0;L<K.length;L++){M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++){Q=N[P].toLowerCase();R=r.toLowerCase();S=R.indexOf(Q);if(S==0){w=M[0];break;}}if(S==0)break;}}S=w?r+u+w+I:'';c=c?c:'c_m';if(c!='0')S=s.getValOnce(S,c,0);if(S){s._campaignID=r?r:'n/a';s._referrer=t?t:'n/a';s._referringDomain=u?u:'n/a';s._campaign=v?v:'n/a';s._channel=w?w:'n/a';s._partner=E?E:'n/a';s._keywords=H?I?I:'Keyword Unavailable':'n/a';if(f&&w!='Typed/Bookmarked'){h.setTime(h.getTime()+f*86400000);s.c_w('s_tbm'+f,1,h);}}");
/* Top 130 Search Engines - Grouped - 9/3/2013 Update */
s.seList="google.,googlesyndication.com|q,as_q|Google>yahoo.com,yahoo.co.jp|p,va|Yahoo!>bing.com|q|Bing>altavista.co,altavista.de|q,r|AltaVista>.aol.,suche.aolsvc.de|q,query|AOL>ask.jp,ask.co|q,ask|Ask>www.baidu.com|wd|Baidu>daum.net,search.daum.net|q|Daum>icqit.com|q|icq>myway.com|searchfor|MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|query,search|Netscape Search>reference.com|q|Reference.com>seznam|w|Seznam.cz>abcsok.no|q|Startsiden>tiscali.it,www.tiscali.co.uk|key,query|Tiscali>"
+"virgilio.it|qs|Virgilio>yandex|text|Yandex.ru>search.cnn.com|query|CNN Web Search>search.earthlink.net|q|Earthlink Search>search.comcast.net|q|Comcast Search>search.rr.com|qs|RoadRunner Search>optimum.net|q|Optimum Search>webcrawler.com|q|Webcrawler>aolsearch.com|q|AOL Search>snapdo.com|q|Snapdo>alot.com|q|Alot>sweetim.com,sweetpacks.com|q|Sweetim>search-results.com|q|Search Results>pch.com|q|PCH>twcc.com|q|TWCC>dogpile.com|q|Dogpile>conduit.com|q|Conduit>incredibar.com|q|Incredibar>"
+"www.verizon.com|q|Verizon>zonealarm.com|q|Zone Alarm>duckduckgo.com|q|Duckduckgo>aolsearch.com|q|AOL Search>mywebsearch.com|searchfor|My Web Search>avg.com|q|AVG>babylon.com|q|Babylon>searchcompletion.com|q|Search Completion>mysearchresults.com|q|My Search Results";

/*
 * Partner Plugin: DFA Check 0.9 - Restrict DFA calls to once a visit,
 * per report suite, per click through. Used in conjunction with VISTA
 */
s.partnerDFACheck = new Function("c", "src", "p", "" + "var s=this,dl=',',cr,nc,q,g,i,j,k,fnd,v=1,t=new Date,cn=0,ca=new Ar" + "ray,aa=new Array,cs=new Array;t.setTime(t.getTime()+1800000);cr=s.c" + "_r(c);if(cr){v=0;}ca=s.split(cr,dl);aa=s.split(s.un,dl);for(i=0;i<a" + "a.length;i++){fnd=0;for(j=0;j<ca.length;j++){if(aa[i]==ca[j]){fnd=1" + ";}}if(!fnd){cs[cn]=aa[i];cn++;}}if(cs.length){for(k=0;k<cs.length;k" + "++){nc=(nc?nc+dl:'')+cs[k];}cr=(cr?cr+dl:'')+nc;s.vpr(p,nc);v=1;}q=" + "s.wd.location.search.toLowerCase();q=s.repl(q,'?','&');g=q.indexOf(" + "'&'+src.toLowerCase()+'=');if(g>-1){s.vpr(p,cr);v=1;}if(!s.c_w(c,cr" + ",t)){s.c_w(c,cr,0);}if(!s.c_r(c)){v=0;}return v>=1;");

/*
 * Function - read combined cookies v 0.36
 */
if (!s.__ccucr) {
    s.c_rr = s.c_r;
    s.__ccucr = true;

    function c_r(k) {
        var s = this,
            d = new Date,
            v = s.c_rr(k),
            c = s.c_rr('s_pers'),
            i, m, e;
        if (v) return v;
        k = s.ape(k);
        i = c.indexOf(' ' + k + '=');
        c = i < 0 ? s.c_rr('s_sess') : c;
        i = c.indexOf(' ' + k + '=');
        m = i < 0 ? i : c.indexOf('|', i);
        e = i < 0 ? i : c.indexOf(';', i);
        m = m > 0 ? m : e;
        v = i < 0 ? '' : s.epa(c.substring(i + 2 + k.length, m < 0 ? c.length : m));
        if (m > 0 && m != e)
            if (parseInt(c.substring(m + 1, e < 0 ? c.length : e)) < d.getTime()) {
                d.setTime(d.getTime() - 60000);
                s.c_w(s.epa(k), '', d);
                v = '';
            }
        return v;
    }
    s.c_r = c_r;
}

/*
 * Utility Function: vpr - set the variable vs with value v
 */
s.vpr = new Function("vs", "v", "if(typeof(v)!='undefined'){var s=this; eval('s.'+vs+'=\"'+v+'\"')}");

/*
 * Plugin Utility: apl (Append to List) v1.1
 * Requires: s.split
 *
 * s.apl(L,v,d,u)
 *   L = source list, empty list is accepted
 *   v = value to append
 *   d = list delimiter
 *   u = (optional, defaults to 0) Unique value check. 
 *       0 = no unique check, value is always appended.
 *       1 = case insensitive check, append only if value isn’t in list.
 *       2 = case sensitive check, append only if value isn’t in list.
 */
s.apl=new Function("l","v","d","u","var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a.length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCase()));}}if(!m)l=l?l+d+v:v;return l");

/*
 * Plugin: clickPast - version 1.0
 * Requires: s.p_fo
 *
 * s.clickPast(V,e1,e2)
 *   V = Variable to check to see if the event identified in e1 should fire.
 *   e1 = event to fire on this page, contingent on the presence of the variable identified in V.
 *   e2 = event to fire on the next page view.
 */
s.clickPast=new Function("scp","ct_ev","cp_ev","cpc","var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc){cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev;s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc,0,0);}}}");
s.p_fo=new Function("n","var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]=new Object;return 1;}else {return 0;}");

/*
 * Plugin: getPercentPageViewed v1.2
 */
s.getPercentPageViewed=new Function("",""
+"var s=this;if(typeof(s.linkType)=='undefined'||s.linkType=='e'){var"
+" v=s.c_r('s_ppv');s.c_w('s_ppv',0);return v;}");
s.getPPVCalc=new Function("",""
+"var s=s_c_il["+s._in+"],dh=Math.max(Math.max(s.d.body.scrollHeight,"
+"s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,s."
+"d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s.d."
+"documentElement.clientHeight)),vph=s.wd.innerHeight||(s.d.documentE"
+"lement.clientHeight||s.d.body.clientHeight),st=s.wd.pageYOffset||(s"
+".wd.document.documentElement.scrollTop||s.wd.document.body.scrollTo"
+"p),vh=st+vph,pv=Math.round(vh/dh*100),cp=s.c_r('s_ppv');if(pv>100){"
+"s.c_w('s_ppv','');}else if(pv>cp){s.c_w('s_ppv',pv);}");
s.getPPVSetup=new Function("",""
+"var s=this;if(s.wd.addEventListener){s.wd.addEventListener('load',s"
+".getPPVCalc,false);s.wd.addEventListener('scroll',s.getPPVCalc,fals"
+"e);s.wd.addEventListener('resize',s.getPPVCalc,false);}else if(s.wd"
+".attachEvent){s.wd.attachEvent('onload',s.getPPVCalc);s.wd.attachEv"
+"ent('onscroll',s.getPPVCalc);s.wd.attachEvent('onresize',s.getPPVCa"
+"lc);}");
s.getPPVSetup();

/*
 * Plugin: setupLinkTrack 2.0.4- return links for HBX-based link
 *         tracking in SiteCatalyst (requires s.split and s.apl)
 */
s.setupLinkTrack=new Function("vl","c",""
+"var s=this;var l=s.d.links,cv,cva,vla,h,i,l,t,b,o,y,n,oc,d='';cv=s."
+"c_r(c);if(vl&&cv!=''){cva=s.split(cv,'^^');vla=s.split(vl,',');for("
+"x in vla)s._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}s.c_w(c,'',0);if(!s.e"
+"o&&!s.lnk)return '';o=s.eo?s.eo:s.lnk;y=s.ot(o);n=s.oid(o);if(s.eo&"
+"&o==s.eo){while(o&&!n&&y!='BODY'){o=o.parentElement?o.parentElement"
+":o.parentNode;if(!o)return '';y=s.ot(o);n=s.oid(o);}for(i=0;i<4;i++"
+")var ltp=setTimeout(function(){},10);if(o.tagName)if(o.tagName.toLowerCase()!='a')if(o.tagName.toLowerC"
+"ase()!='area')o=o.parentElement;}b=s._LN(o);o.lid=b[0];o.lpos=b[1];"
+"if(s.hbx_lt&&s.hbx_lt!='manual'){if((o.tagName&&s._TL(o.tagName)=='"
+"area')){if(!s._IL(o.lid)){if(o.parentNode){if(o.parentNode.name)o.l"
+"id=o.parentNode.name;else o.lid=o.parentNode.id}}if(!s._IL(o.lpos))"
+"o.lpos=o.coords}else{if(s._IL(o.lid)<1)o.lid=s._LS(o.lid=o.text?o.t"
+"ext:o.innerText?o.innerText:'');if(!s._IL(o.lid)||s._II(s._TL(o.lid"
+"),'<img')>-1){h=''+o.innerHTML;bu=s._TL(h);i=s._II(bu,'<img');if(bu"
+"&&i>-1){eval(\"__f=/ src\s*=\s*[\'\\\"]?([^\'\\\" ]+)[\'\\\"]?/i\")"
+";__f.exec(h);if(RegExp.$1)h=RegExp.$1}o.lid=h}}}h=o.href?o.href:'';"
+"i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l"
+"=s.linkName?s.linkName:s._hbxln(h);t=s.linkType?s.linkType.toLowerC"
+"ase():s.lt(h);oc=o.onclick?''+o.onclick:'';cv=s.pageName+'^^'+o.lid"
+"+'^^'+s.pageName+' > '+(o.lid=o.lid?o.lid:'no &lid')+'^^'+o.lpos;if"
+"(t&&(h||l)){cva=s.split(cv,'^^');vla=s.split(vl,',');for(x in vla)s"
+"._hbxm(vla[x])?s[vla[x]]=cva[x]:'';}else if(!t&&oc.indexOf('.tl(')<"
+"0){s.c_w(c,cv,0);}else return ''");
s._IL=new Function("a","var s=this;return a!='undefined'?a.length:0");
s._II=new Function("a","b","c","var s=this;return a.indexOf(b,c?c:0)");
s._IS=new Function("a","b","c",""
+"var s=this;return b>s._IL(a)?'':a.substring(b,c!=null?c:s._IL(a))");
s._LN=new Function("a","b","c","d",""
+"var s=this;b=a.href;b+=a.name?a.name:'';c=s._LVP(b,'lid');d=s._LVP("
+"b,'lpos');return[c,d]");
s._LVP=new Function("a","b","c","d","e",""
+"var s=this;c=s._II(a,'&'+b+'=');c=c<0?s._II(a,'?'+b+'='):c;if(c>-1)"
+"{d=s._II(a,'&',c+s._IL(b)+2);e=s._IS(a,c+s._IL(b)+2,d>-1?d:s._IL(a)"
+");return e}return ''");
s._LS=new Function("a",""
+"var s=this,b,c=100,d,e,f,g;b=(s._IL(a)>c)?escape(s._IS(a,0,c)):esca"
+"pe(a);b=s._LSP(b,'%0A','%20');b=s._LSP(b,'%0D','%20');b=s._LSP(b,'%"
+"09','%20');c=s._IP(b,'%20');d=s._NA();e=0;for(f=0;f<s._IL(c);f++){g"
+"=s._RP(c[f],'%20','');if(s._IL(g)>0){d[e++]=g}}b=d.join('%20');retu"
+"rn unescape(b)");
s._LSP=new Function("a","b","c","d","var s=this;d=s._IP(a,b);return d"
+".join(c)");
s._IP=new Function("a","b","var s=this;return a.split(b)");
s._RP=new Function("a","b","c","d",""
+"var s=this;d=s._II(a,b);if(d>-1){a=s._RP(s._IS(a,0,d)+','+s._IS(a,d"
+"+s._IL(b),s._IL(a)),b,c)}return a");
s._TL=new Function("a","var s=this;return a.toLowerCase()");
s._NA=new Function("a","var s=this;return new Array(a?a:0)");
s._hbxm=new Function("m","var s=this;return (''+m).indexOf('{')<0");
s._hbxln=new Function("h","var s=this,n=s.linkNames;if(n)return s.pt("
+"n,',','lnf',h);return ''");

/*
 * Plugin: getTimeToComplete
 *
 * s.getTimeToComplete(v,c,e)
 *   v = the value – 'start' or 'stop'
 *   c = the cookie name – example: 's_gttc'
 *   e = the cookie expiration – days to expiration of the cookie, 0 for session
 *
 * To allow getTimeToComplete to start and stop on the same pageload, set s.ttcr="" prior to firing "stop".
 */
s.getTimeToComplete=new Function("v","cn","e","var s=this,d=new Date,x=d,k;if(!s.ttcr){e=e?e:0;if(v=='start'||v=='stop')s.ttcr=1;x.setTime(x.getTime()+e*86400000);if(v=='start'){s.c_w(cn,d.getTime(),e?x:0);return '';}if(v=='stop'){k=s.c_r(cn);if(!s.c_w(cn,'',d)||!k)return '';v=(d.getTime()-k)/1000;var td=86400,th=3600,tm=60,r=5,u,un;if(v>td){u=td;un='days';}else if(v>th){u=th;un='hours';}else if(v>tm){r=2;u=tm;un='minutes';}else{r=.2;u=1;un='seconds';}v=v*r/u;return (Math.round(v)/r)+' '+un;}}return '';");


//ORDER: 3 - Marketing Channel Logic fires

// TODO: Why is this located here?
var mediaChannelResult = getMediaChannel(s);


//ORDER: 4 - DFA Integration would fire if not commented out

/****************** DFA Integrate Module determines DFA CT & DFA VT ******************/
/*
s.loadModule("Integrate");
s.Integrate.onLoad = function (s, m) {
	var dfaCheck = s.partnerDFACheck(dfa_visitCookie, dfa_overrideParam, dfa_newRsidsProp);
	if (dfaCheck) {
		s.Integrate.add("DFA");
		s.Integrate.DFA.tEvar = dfa_tEvar;
		s.Integrate.DFA.errorEvar = dfa_errorEvar;
		s.Integrate.DFA.timeoutEvent = dfa_timeoutEvent;
		s.Integrate.DFA.CSID = dfa_CSID;
		s.Integrate.DFA.SPOTID = dfa_SPOTID;
		s.Integrate.DFA.get(dfa_requestURL);
		s.Integrate.DFA.setVars = function (s, p) {
			if (window[p.VAR]) { // got a response
				if (!p.ec) { // no errors
					s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lcs ? p.lcs : 0) + "-" + (p.lcp ? p.lcp : 0) + "-" + (p.lastclk ? p.lastclk : 0) + "-" + (p.lastclktime ? p.lastclktime : 0)
					// in case an ad does not go through the DFA clicktracker
					if (s.getQueryParam('adid') && (!p.lastclktime || p.lastclktime == 0)) {
						s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0)
					}
					if (s[p.tEvar]) {
						var td = new Date();
						if (s[p.tEvar]) {
							var s__dfa = '';
							s__dfa = s.split(s[p.tEvar], '-')
							if (s__dfa[8] && s__dfa[4]) {
								if (s.getQueryParam('utm_medium') && !s.getQueryParam('adid')) {
									if (((td.getTime() / 1000 - s__dfa[8]) < 120 && s.getQueryParam('adid')) || ((td.getTime() / 1000 - s__dfa[4]) < 120 && s.getQueryParam('adid'))) {
										s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lcs ? p.lcs : 0) + "-" + (p.lcp ? p.lcp : 0) + "-" + (p.lastclk ? p.lastclk : 0) + "-" + (p.lastclktime ? p.lastclktime : 0)
										if (!isSEO)
											s.events = "event11";
									} else if (s__dfa[8] < s__dfa[4] && (td.getTime() / 1000 - s__dfa[4]) < 2592000) {
										s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lcs ? p.lcs : 0) + "-" + (p.lcp ? p.lcp : 0) + "-" + (p.lastclk ? p.lastclk : 0) + "-" + (p.lastclktime ? p.lastclktime : 0)
										if (!isSEO)
											s.events = "event11";
									}
									setCookie('sc_hcp_ctc', 1, 0, 30)
								} else if (((td.getTime() / 1000 - s__dfa[8]) < 120 && s.getQueryParam('adid')) || ((td.getTime() / 1000 - s__dfa[4]) < 120 && s.getQueryParam('adid'))) {
									//s.campaign = "DFA:"+(p.lcs?p.lcs:0)+":"+(p.lcp?p.lcp:0)+":"+(p.lastclk?p.lastclk:0);
									s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lcs ? p.lcs : 0) + "-" + (p.lcp ? p.lcp : 0) + "-" + (p.lastclk ? p.lastclk : 0) + "-" + (p.lastclktime ? p.lastclktime : 0)
									if (!isSEO) {
										s.campaign = "";
										s.eVar13 = "DFA:CT:" + (p.lcs ? p.lcs : 0) + ":" + (p.lcp ? p.lcp : 0) + ":" + (p.lastclk ? p.lastclk : 0);
										s.events = "event11";
										s.eVar4 = "DFA:CT";
										s.prop5 = "DFA:CT : " + s.pageName;
										s.eVar5		= overwriteMediums(s.c_r('sc_hcp_mediums'),"DFA:CT")
										s.eVar11 = '0-3h';
									}
									setCookie('sc_hcp_ctc', 1, 0, 30)
								} else if (s__dfa[8] < s__dfa[4] && (td.getTime() / 1000 - s__dfa[4]) < 2592000) {
									s[p.tEvar] = "DFA-" + (p.lis ? p.lis : 0) + "-" + (p.lip ? p.lip : 0) + "-" + (p.lastimp ? p.lastimp : 0) + "-" + (p.lastimptime ? p.lastimptime : 0) + "-" + (p.lcs ? p.lcs : 0) + "-" + (p.lcp ? p.lcp : 0) + "-" + (p.lastclk ? p.lastclk : 0) + "-" + (p.lastclktime ? p.lastclktime : 0)
									if (!isSEO) {
										s.campaign = "";
										s.eVar4 = "DFA:VT";
										s.eVar13 = "DFA:VT:" + (p.lis ? p.lis : 0) + ":" + (p.lip ? p.lip : 0) + ":" + (p.lastimp ? p.lastimp : 0);
										s.prop5 = "DFA:VT : " + s.pageName;
										s.eVar11 = '0-3h';
										s.eVar5		= overwriteMediums(s.c_r('sc_hcp_mediums'),"DFA:VT")
										isViewThrough = true;
										isClickThrough = false;
									}
									setCookie('sc_DFA_ctc', 1, 1825, 0)
								}
							}
						}
						// s[p.tEvar] = s.eVar13.replace(':VT','').replace(':CT','');
					}
				} else if (p.errorEvar) { // got an error response, track
					s[p.errorEvar] = p.ec;
				}
			} else if (p.timeoutEvent) { // empty response or timeout
				s.events = ((!s.events || s.events == '') ? '' : (s.events + ',')) + p.timeoutEvent; // timeout event
			}
		}
	}
}
*/

//ORDER: 5 - Integrate variable defined

s.m_Integrate_c="var m=s.m_i('Integrate');m.add=function(n,o){var m=this,p;if(!o)o='s_Integrate_'+n;if(!s.wd[o])s.wd[o]=new Object;m[n]=new Object;p=m[n];p._n=n;p._m=m;p._c=0;p._d=0;p.disable=0;p.get"
+"=m.get;p.delay=m.delay;p.ready=m.ready;p.beacon=m.beacon;p.script=m.script;m.l[m.l.length]=n};m._g=function(t){var m=this,s=m.s,i,p,f=(t?'use':'set')+'Vars',tcf;for(i=0;i<m.l.length;i++){p=m[m.l[i]"
+"];if(p&&!p.disable&&p[f]){if(s.apv>=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','p','f','var e;try{p[f](s,p)}catch(e){}');tcf(s,p,f)}else p[f](s,p)}}};m._t=function(){this._g(1)};m._fu=function"
+"(p,u){var m=this,s=m.s,x,v,tm=new Date;if(u.toLowerCase().substring(0,4) != 'http')u='http://'+u;if(s.ssl)u=s.rep(u,'http:','https:');p.RAND=Math&&Math.random?Math.floor(Math.random()*1000000000000"
+"0):tm.getTime();p.RAND+=Math.floor(tm.getTime()/10800000);for(x in p)if(x&&x.substring(0,1)!='_'&&(!Object||!Object.prototype||!Object.prototype[x])){v=''+p[x];if(v==p[x]||parseFloat(v)==p[x])u="
+"s.rep(u,'['+x+']',s.rep(escape(v),'+','%2B'))}return u};m.get=function(u,v){var p=this,m=p._m;if(!p.disable){if(!v)v='s_'+m._in+'_Integrate_'+p._n+'_get_'+p._c;p._c++;p.VAR=v;p._d++;m.s.loadModule("
+"'Integrate:'+v,m._fu(p,u),0,1,p._n)}};m.delay=function(){var p=this;if(p._d<=0)p._d=1};m.ready=function(){var p=this,m=p._m;p._d=0;if(!p.disable)m.s.dlt()};m._d=function(){var m=this,i,p;for(i=0;i<"
+"m.l.length;i++){p=m[m.l[i]];if(p&&!p.disable&&p._d>0)return 1}return 0};m._x=function(d,n){var p=this[n],x;if(!p.disable){for(x in d)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))p[x]=d["
+"x];p._d--}};m.beacon=function(u){var p=this,m=p._m,s=m.s,imn='s_i_'+m._in+'_Integrate_'+p._n+'_'+p._c,im;if(!p.disable&&s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){p._c++;i"
+"m=s.wd[imn]=new Image;im.src=m._fu(p,u)}};m.script=function(u){var p=this,m=p._m;if(!p.disable)m.s.loadModule(0,m._fu(p,u),0,1)};m.l=new Array;if(m.onLoad)m.onLoad(s,m)";
s.m_i("Integrate");


//ORDER: 1 - functions loaded into memory on file load

/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s.version='H.26.2';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\"
+"\\\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}retur"
+"n y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;ret"
+"urn 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent("
+"x);for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.su"
+"bstring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n,n+1)+e;n=(n-n)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+"
+"','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00"
+"'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unesc"
+"ape(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r"
+";z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring("
+"0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf'"
+",f);return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visi"
+"bilitychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){whil"
+"e(s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\")"
+";s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.li"
+"nkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostnam"
+"e,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'"
+".','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<"
+"0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-6"
+"0);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':''"
+");return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i"
+";l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tc"
+"f=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s"
+".wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0"
+";return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return "
+"s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)fo"
+"r(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackin"
+"gServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+s._in+'_'+un,im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLow"
+"erCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.vers"
+"ion+(s.tcn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if"
+"(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]"
+"=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd["
+"imn];if(!im)im=s.wd[imn]=new Image;im.alt=\"\";im.s_l=0;im.onload=im.onerror=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!"
+"s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window"
+".s_c_il)window.s_c_il['+s._in+'].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||ta=='_parent'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e"
+".getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'"
+"+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,"
+"l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x;i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='ht"
+"tps://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h.substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l="
+"',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length>1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'"
+"+c;else c=''}i=253-(q.length-c.length)-y.length;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextDat"
+"a\")k=\"c\";if(v){for(sk in v)if((!f||sk.substring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(n"
+"fn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nfl[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){n"
+"k=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!nfl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLi"
+"ghtData'&&f.indexOf('.contextData.')<0){sp=sk.substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(s"
+"p=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return "
+"qs};s.hav=function(){var s=this,qs='',l,fv='',fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe"
+"=s.linkTrackEvents;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if"
+"(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv|"
+"|fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!='linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>25"
+"5){s.pageURLRest=v.substring(255);v=v.substring(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if("
+"k=='visitorMigrationServer'){q='vmf';if(s.ssl&&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){"
+"q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';e"
+"lse if(k=='variableProvider')q='vvp';else if(k=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else"
+" if(k=='colorDepth')q='c';else if(k=='javascriptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';el"
+"se if(k=='connectionType')q='ct';else if(k=='homepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextDa"
+"ta'){qs+=s.s2q('c',s[k],fv,k,0);v=''}else if(k=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProf"
+"ileID)v=''}else if(k=='retrieveLightProfiles')q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if"
+"(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return "
+"qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?'),hi=h.indexOf('#');if(qi>=0){if(hi>=0&&hi<qi)qi=hi;}else qi=hi;h=qi>=0?h.substring(0,qi):h;if(t&&h.substr"
+"ing(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.li"
+"nkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.tra"
+"ckExternalLinks&&h.indexOf('#')!=0&&h.indexOf('about:')!=0&&h.indexOf('javascript:')!=0&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new F"
+"unction('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;if(b)return this[b](e);return true');s.bcr=function(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if"
+"(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.bct.href}s.bct=s.bce=s.bcf=0};s.bc=new Function('e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs,"
+"a,h;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else if(!s.useForcedLinkTracking){s.b.removeEventListener(\"click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;retu"
+"rn}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e.target;nrs=s.nrs;s.t();s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.target){a=e.target;while(a&&a!=s.b&&a.t"
+"agName.toUpperCase()!=\"A\"&&a.tagName.toUpperCase()!=\"AREA\")a=a.parentNode;if(a){h=a.href;if(h.indexOf(\"#\")==0||h.indexOf(\"about:\")==0||h.indexOf(\"javascript:\")==0)h=0;t=a.target;if(e.targ"
+"et.dispatchEvent&&h&&(!t||t==\"_self\"||t==\"_top\"||t==\"_parent\"||(s.wd.name&&t==s.wd.name))){tcf=new Function(\"s\",\"var x;try{n=s.d.createEvent(\\\\\"MouseEvents\\\\\")}catch(x){n=new MouseEv"
+"ent}return n\");n=tcf(s);if(n){tcf=new Function(\"n\",\"e\",\"var x;try{n.initMouseEvent(\\\\\"click\\\\\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e"
+".altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget)}catch(x){n=0}return n\");n=tcf(n,e);if(n){n.s_fe=1;e.stopPropagation();if (e.stopImmediatePropagation) {e.stopImmediatePropagation();}e.preven"
+"tDefault();s.bct=e.target;s.bce=n}}}}}');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>"
+"k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.subst"
+"ring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.scopeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE')t=''"
+";if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.pr"
+"otocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');"
+"x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s"
+"_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un."
+"indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,',','r"
+"q',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[un]=q;"
+"return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Object."
+"prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'"
+"='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o.oncl"
+"ick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie||!s.i"
+"smac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener){if(s.n&&((s.n.userAgent.indexOf('WebKit')>=0&&s.d.createEvent)||(s.n.userAgent.indexOf('F"
+"irefox/2')>=0&&s.wd.MouseEvent))){s.bbc=1;s.useForcedLinkTracking=1;s.b.addEventListener('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function"
+"(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))ret"
+"urn 0;n=x}if(n000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring"
+"(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCas"
+"e();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa"
+"=function(un){var s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.s"
+"ubstring(0,1),r,l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd"
+".s_c_in++;m.s=s;m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r"
+"=m._r;r._m=m;l=m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_i"
+"l['+s._in+'],c=s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m"
+"=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_"
+"'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m"
+"[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var "
+"s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){"
+"i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'ht"
+"tp:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e"
+"?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','va"
+"r e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i"
+"=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]="
+"o}}else if(n){m=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=this,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData"
+"\")&&s[k])for(x in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function(vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il"
+"['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s."
+"dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dl"
+"l.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){var s=this,d='0123456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;"
+"i<16;i++){j=Math.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.floor(Math.random()*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e)"
+")fid=0;return fid};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)+se"
+"d,y=tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,"
+"q='',qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y"
+"':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach"
+"){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1.7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.parse){j='1.8."
+"2';if(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth"
+";bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeig"
+"ht;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var "
+"e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexO"
+"f(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}i"
+"f(vo){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);if(!s.abort){var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s.pageURL=l.href?l.href:l"
+";if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!"
+"n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s_gs(')>=0&&oc.indexOf('"
+".s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkType.toLowerCase():s.lt(h)"
+";if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else trk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(o.dataset&&o.da"
+"taset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-object-id')){s.wd.s_objectID=o.getAttribute('data-s-object-id');}else if(s.useForcedLinkTracking"
+"){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\").indexOf(oc.charAt(ocb))>=0)ocb++;if(o"
+"cb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt(oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")ocx=!ocx;else ocx=0;}else{ocq=oc.charAt("
+"oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s)}}}}}if(s.gg('objectID')){n=s.gg('obje"
+"ctID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}if(trk||qs){s.sampled=s.vs(sed);if"
+"(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLightProfiles=s.deleteLightProfiles="
+"''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_linkNam"
+"e=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType=t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss,i,vo){var s=this;s.lig"
+"htProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){var s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l[i];if(t&&t._c=='s_l'&&t"
+".tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.ml)for(x in t.ml)if(s[x]"
+"){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf('s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];if(s[x.m]){y=s[x.m];if(y"
+"[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.location.protocol.toLower"
+"Case().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape"
+"6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscap"
+"e');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.n"
+"s6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4"
+"%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visitorID,fid,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet"
+",visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCode,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProfiles,deleteLightProfile"
+"s,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSeconds,lightIncrementBy';"
+"s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_t+=',prop'+n+',eVar'+n;"
+"s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,jav"
+"aEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingS"
+"erverBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLi"
+"nks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_referrer,un';s.va_g=s.sp(s.v"
+"l_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();if(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1).t()};s.wd.s_dc=functi"
+"on(un){s_gi(un,1).t()}}",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);return s}
function s_giqf(){var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0}s_giqf()

// Logic
//Set cookies
function setCookie(c_name, value, exdays, exminutes) {
    var exdate = new Date();
    if (exdays > 0)
        exdate.setDate(exdate.getDate() + exdays);
    else
        exdate.setTime(exdate.getTime() + (exminutes * 60 * 1000));
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()) + ";domain=" + s.cookieDomain + ";path=" + s.cookiePath;;
    document.cookie = c_name + "=" + c_value;
}
//Get cookies
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return false;
}

function buildSObject(s) {
    pl = /\+/g, // Regex for replacing addition symbol with a space
    decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);
	
    /*************** Determine page type ********************/
    isForm = bt_isForm;
    isConfirmation = bt_isConfirmation;
    isErrorPage = bt_isErrorPage;
	
    /*************** Custom Variables ********************/
    if (typeof (bt_customVariables) != 'undefined') {
        for (var i in bt_customVariables) {
            s[i] = bt_customVariables[i];
        }
    }
	
	/*************** Internal Search ***************/
	if (bt_isSearchResultsPage){
		var tempSearchResult = typeof(bt_intSearchResultsCount) != 'undefined' ? parseInt(bt_intSearchResultsCount) : 0;
		if (tempSearchResult > 0) {
			s.events = s.apl(s.events,"event27",',',1);
			s.prop16 = bt_intSearchKeyword;
			s.eVar16 = "D=c16";
			s.prop19=s.eVar19 = tempSearchResult;
		}
		else {
			s.events = s.apl(s.events,"event28",',',1);
			s.prop16 = bt_intSearchKeyword;
			s.eVar16 = "D=c16";
			s.prop19=s.eVar19 = "Zero";
		}
	}

    /*************** Populate Data ********************/
    s.visitPageNum = getVisitPageViews();
    s.pageName = bt_pageName;
    s.channel = bt_channel;
    s.prop1 = bt_prop1;
    s.prop2 = bt_prop2;
    s.prop3 = bt_prop3;
    s.prop4 = s.getPreviousValue(s.pageName, 's_gpv_pn', '');
    s.prop5 = s.pageName; // For pathing
    if (!!mediaChannelResult.source && mediaChannelResult.source != "undefined")
        s.prop5 = mediaChannelResult.source + " : " + s.prop5;
    s.prop6 = s.getVisitNum();
    s.eVar14 = s.getVisitNum();
    if (s.visitPageNum == 1) s.eVar14 = s.prop6; // Set the visit number in eVar14 on first page of visit.
    // change cookie name for multiple
    s.prop7 = s.getDaysSinceLastVisit('sc_hcp_daysLastTouch');
    s.prop10 = "Visit Page View: " + s.visitPageNum;
    s.prop11 = "Lifetime Page Views: " + getLifetimePageViews();
    s.eVar1 = omVisitorId;
    s.hier1 = s.prop1 + ' | ' + s.channel + ' | ' + s.prop2 + ' | ' + s.prop3;
    if (isForm) {
		s.events = s.apl(s.events,'event1',',',1);
		s.prop30 = !!formName ? formName : s.formName; // Either the name passed to us or the name we set in BT
		s.eVar30 = "D=c30";
		s.ttcr	 = ""; // Allows getTimeToComplete to start and stop on the same pageload.
		s.prop25 = s.getTimeToComplete('start','s_gttc_'+s.prop30.replace(/[ ()]/g,""),0);
		s.prop32 = "D=c6";
    }
    if (isConfirmation) {
		s.events = s.apl(s.events,'event2',',',1);
		s.prop30 = !!formName ? formName : s.formName; // Either the name passed to us or the name we set in BT
		s.eVar30 = "D=c30";
		if (s.prop30.indexOf("stay-connected-form") > -1)
			s.events = s.apl(s.events,'event31',',',1);
		s.ttcr	 = ""; // Allows getTimeToComplete to start and stop on the same pageload.
		s.prop25 = s.getTimeToComplete('stop','s_gttc_'+s.prop30.replace(/[ ()]/g,""),0);
		s.prop31 = !!s.fieldValues ? implodeFieldValues("|", s.fieldValues) : typeof (fieldValues) != 'undefined' ? implodeFieldValues("|", fieldValues) : "no data";
		if(s.prop30=="stay-connected-form"){
		s.prop31            = "PR=" +$.cookie('sc_tyk');
		s.eVar41			= "PR=" +$.cookie('sc_tyk');
		}
		// Remove PII from AddAbilify's Free Trial form values
		if (!!s.prop31 && s.prop1 == "ADD Abilify" && s.prop30 == "Free Trial"){
			tempArr = s.prop31.split('|');
			s.prop31 = tempArr[8] ? tempArr[8] : '';
			s.prop31 += tempArr[9] ? '|' + tempArr[9] : '';
			s.prop31 += tempArr[10] ? '|' + tempArr[10] : '';
		}
		var aReturn = getNoOfDaysSinceEntry();
		s.eVar31 = aReturn.allChannels;
		s.eVar32 = aReturn.viewThroughChannels;
		s.prop32 = "D=c6";
		s.prop33 = typeof (transactionID) == 'undefined' ? "no data" : transactionID;
		s.eVar33 = "D=c33";
    }
    if (!isWebsiteBrowsing) {
        setChannelTimestamp(mediaChannelResult);
        if (isViewThrough) {
            setVTChannelTimestamp(mediaChannelResult);
        }
    }
    if (isErrorPage) {
        s.pageType = "errorPage";
		s.pageName = "";
    }
	if (typeof bt_formErrors != 'undefined' && bt_formErrors != '' && (!!formName || !!s.formName)){
		s.events = s.apl(s.events,"event32",',',1);
		s.prop35 = implodeFieldValues("|", bt_formErrors);
		s.prop22 = !!formName ? formName+' > Form Error' : s.formName+' > Form Error';
		s.eVar22 = "D=c22";
	}
	if (getCookie('sc_DFA_ctc') == 1 && !isClickThrough) {
        s.events = s.apl(s.events,'event13',',',1);
		setCookie('sc_DFA_ctc', 0, 0, 30)
	}
	if (isClickThrough) {
		s.campaign = mediaChannelResult.campaign;
		s.eVar13 = s.eVar13 || s.campaign;
		s.eVar4 = mediaChannelResult.source;
		//s.eVar5 = mediaChannelResult.medium != "" ? getStackedUTMMediums(mediaChannelResult) : "";
		s.eVar9 = s.pageName;
	}
}
/****** Events Handlers **********/
// We need to add the on load event because most handlers need to be added after the html has completed loading.

function setChannelTimestamp(mediaChannelResult) {
    var sAllChannels = getCookie('sc_a_chnl');
    var oChannels = {};
    if (typeof (sAllChannels) != 'undefined' && sAllChannels != 0) {
        if (sAllChannels.indexOf(';') != -1) {
            var temp,
				otmpChannels = sAllChannels.split(';');
            for (var i in otmpChannels) {
				temp = otmpChannels[i] + "";
				temp = temp.split('=');
				oChannels[temp[0]] = temp[1];
            }
        } else {
            var temp = sAllChannels.split('=');
            oChannels[temp[0]] = temp[1];
        }
    }
    var d = new Date();
    var nowUTC = Math.floor(d.getTime() / 1000);
    if (typeof (mediaChannelResult.source) != 'undefined' && mediaChannelResult.source != '') {
        var src = mediaChannelResult.source;
        oChannels[String(src)] = String(nowUTC);
    }
    var aCookieStr = {};
    var j = 0;
    for (var i in oChannels) {
        if (i.indexOf('function') == -1) {
            aCookieStr[j] = i + '=' + oChannels[i];
            j++;
        }
    }
    var sCookieStr = implode(";", aCookieStr);
    setCookie('sc_a_chnl', sCookieStr, 1825, 0)
}

function setVTChannelTimestamp(mediaChannelResult) {
    var sVTChannels = getCookie('sc_v_chnl');
    var oChannels = {};
    if (sVTChannels != 0 && typeof (sVTChannels) != 'undefined') {
        if (sVTChannels.indexOf(';') != -1) {
            var otmpChannels = sVTChannels.split(';');
            for (var i in otmpChannels) {
                var tmp = otmpChannels[i]
                var temp = tmp + "";
                temp = temp.split('=');
                var sKey = tmp[0];
                var sVal = tmp[1];
                oChannels[sKey] = sVal;
            }
        } else {
            var tmp = sVTChannels.split('=');
            var sKey = tmp[0];
            var sVal = tmp[1];
            oChannels[sKey] = sVal;
        }
    }
    var d = new Date();
    var nowUTC = Math.floor(d.getTime() / 1000);
    if (mediaChannelResult.source != '' && typeof (mediaChannelResult.source) != 'undefined')
        oChannels[mediaChannelResult.source] = nowUTC;
    var aCookieStr = [];
    var j = 0;
    for (var i in oChannels) {
        if (i.indexOf('function') == -1) {
            aCookieStr[j] = i + '=' + oChannels[i];
            j++;
        }
    }
    var sCookieStr = implode(";", aCookieStr);
    setCookie('sc_v_chnl', sCookieStr, 1825, 0)
}

function getNoOfDaysSinceEntry(s) {
    //All Channels
    var oReturn = {};
    var d = new Date();
    var nowUTC = d.getTime() / 1000;
    var sAllChannels = getCookie('sc_a_chnl');
    var oChannels = {};
    var nOneDay = 24 * 60 * 60;
    if (sAllChannels != 0 && typeof (sAllChannels) != 'undefined') {
        var sEvar31 = "";
        var j = 0;
        if (sAllChannels.indexOf(';') != -1) {
            var otmpChannels = sAllChannels.split(';');
            for (var i in otmpChannels) {
                var tmp = otmpChannels[i]
                var temp = tmp + "";
                temp = temp.split('=');
                var sKey = temp[0];
                var sVal = temp[1];
                var sDays = Math.floor((nowUTC - parseFloat(sVal)) / nOneDay);
                if (sDays <= 30) {
                    oChannels[j] = sKey + ":" + sDays;
                    j++;
                }
            }
        } else {
            temp = sAllChannels.split('=');
            var sKey = temp[0];
            var sVal = temp[1];
            var sDays = Math.floor((nowUTC - parseFloat(sVal)) / nOneDay);
            if (sDays <= 30) {
                oChannels[j] = sKey + ":" + sDays;
                j++;
            }
        }
        oReturn['allChannels'] = implode('::', oChannels);
    }
    var sVTChannels = getCookie('sc_v_chnl');
    var oChannels = {};
    if (sVTChannels != 0) {
        var j = 0;
        if (sVTChannels.indexOf(';') != -1) {
            var otmpChannels = sVTChannels.split(';');
            for (var i in otmpChannels) {
                var tmp = otmpChannels[i].split('=');
                var sKey = tmp[0];
                var sVal = tmp[1];
                var sDays = Math.floor((nowUTC - parseFloat(sVal)) / nOneDay);
                if (sDays <= 30) {
                    oChannels[j] = sKey + "::" + sDays;
                    j++;
                }
            }
        } else {
            var tmp = sVTChannels.split('=');
            var sKey = tmp[0];
            var sVal = tmp[1];
            var sDays = Math.floor((nowUTC - parseFloat(sVal)) / nOneDay);
            if (sDays <= 30) {
                oChannels[j] = sKey + "::" + sDays;
                j++;
            }
        }
        oReturn['viewThroughChannels'] = implode('::', oChannels);
    }
    return oReturn;
}

/***** Campaign Data *****/
// Marketing - Last Click - Email, SEO, Paid Search, Referral, Social Media, Display Click
/** Get stacked UTM Mediums **/

function getStackedUTMMediums(mediaChannelResult) {
    //TODO: Limit number of channels in the stack
    var sMediums = getCookie('sc_hcp_mediums');
    if (sMediums == 0)
        sMediums = "";
    if (!!sMediums && !!mediaChannelResult.medium)
        sMediums += ' > ' + mediaChannelResult.medium;
    else if (!!mediaChannelResult.medium)
        sMediums = mediaChannelResult.medium;
    else if (!!mediaChannelResult.campaign)
        sMediums = sMediums + ' > ' + mediaChannelResult.campaign;
    setCookie('sc_hcp_mediums', sMediums, 1825, 0) //1825 days
    return sMediums;
}

function overwriteMediums(originalMediums, sValue) {
    if (originalMediums == 0)
        sMediums = sValue;
    else {
        sMediums = originalMediums + ' > ' + sValue;
    }
    setCookie('sc_hcp_mediums', sMediums, 1825, 0) //1825 days
    return sMediums;
}
/** Get Page Views count per Visit, increments the count and overwrites the same cookie extending the expiration by 30 minutes **/

function getVisitPageViews() {
    var pagesVisit = getCookie('sc_hcp_pgVwVst');
    pagesVisit++;
    setCookie('sc_hcp_pgVwVst', pagesVisit, 0, 1800) // 1800 seconds, 30 minutes
    return pagesVisit;
}
/** Get Page Views count for lifetime, increments the count and overwrites the same cookie extending the expiration by 1825 days (5 years) **/

function getLifetimePageViews() {
    var pagesLifetime = getCookie('sc_hcp_pgVwLftm');
    pagesLifetime++;
    setCookie('sc_hcp_pgVwLftm', pagesLifetime, 1825, 0)
    return pagesLifetime;
}
/* get host from url */

function getHostname(str) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    if (str.match(re) != null)
        return str.match(re)[1].toString();
    else
        return false;
}
/**** Test URL if it's external or not *****/

function isExternal(url) {
    var tempLink = document.createElement('a');
    tempLink.href = url;
    return !(tempLink.hostname === window.location.hostname);
}
/***** Get media channel ******/

function getMediaChannel(s) {
    /* External campaign tracking with channel manager */
	var campaign = "",
		medium,
		sSource,
		oReturn = {};
    
	// Run channelManager
	s.channelManager('utm_medium,utm_source,utm_campaign,utm_content,utm_term,utm_creative','','','','s_cmtb',1);

	// Only perform the following logic if channelManager determined that the user entered from a new channel
	if (s._channel){
		// channelManager does not return aything if the same channel is encountered consecutively.
		// Only set the following variables if it returns s._channel.
		
		// Array of Marketing Channel query string parameters. Array keys are eVar numbers.
		var aMCParams = [];
		aMCParams[4] = s.getQueryParam('utm_medium');
		aMCParams[25] = s.getQueryParam('utm_source');
		aMCParams[26] = s.getQueryParam('utm_campaign');
		aMCParams[27] = s.getQueryParam('utm_content');
		aMCParams[28] = s.getQueryParam('utm_term');
		aMCParams[29] = s.getQueryParam('utm_creative');
		// Populate MC eVars and build campaign variable
		for (var key in aMCParams){
			if (aMCParams[key]){
				s['eVar'+key] = aMCParams[key];
				campaign+=aMCParams[key]+" : ";
			} else {
				campaign+="undefined : ";
			}
		}
		// Cut off trailing " : "
		campaign = campaign.substring(0, campaign.length - 3);
		
		if (campaign == "undefined : undefined : undefined : undefined : undefined : undefined")
			isClickThrough = false;
		else if (!!aMCParams[4])
			medium = aMCParams[4];
		
		// Default the keyword eVars
		s.eVar7 = "Other Channel";
		s.eVar8 = "Other Channel";
		
		// Channel-specific logic
		switch (s._channel){
			case 'Paid Search':
				//set medium and source
				medium = sSource = !!medium ? medium : 'undefined';
				//set paid search keyword
				s.eVar7 = !!aMCParams[28] ? aMCParams[28] : s._keywords;
				//overwrite natural search keyword
				s.eVar8 = "Other Channel";
				isClickThrough = true;
				break;
				
			case 'Natural Search':
				//set s.campaign so it overwrites previous campaign
				campaign=medium="SEO : " + s._partner;
				sSource="SEO"; // Otsuka only for now
				//overwrite paid search keyword
				s.eVar7 = "Other Channel";
				//set natural search keyword
				s.eVar8 = s._keywords;
				isClickThrough = true;
				break;
			
			case "Unknown Paid Channel":
				sSource = aMCParams[4];
				isClickThrough = true;
				break;
			
			case "Other Natural Referrers":
				sSource = "Referrer";
				campaign=medium= s.referrerDomain ? "Referrer:"+s.referrerDomain : "Referrer:"+document.referrer;
				isClickThrough = true;
				break;
				
			case "Typed/Bookmarked":
				sSource = "Direct";
				isClickThrough = false;
				break;
			
			default:
				sSource = s._channel;
				isClickThrough = true;
				
		} // end switch statement
		
		// Stack channels
		s.eVar5=s.crossVisitParticipation(sSource,'s_v5','1825','5',' > ');
		
	} // end if(s._channel)

	// Set click-through and click-past events
	s.clickPast(isClickThrough,'event11','event12','s_cmcp');

	return {
		'source': sSource,
		'campaign': campaign,
		'medium': medium
	}
	
}

function implode(glue, pieces) {
    // http://kevin.vanzonneveld.net
    // + original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // + improved by: Waldo Malqui Silva
    // + improved by: Itsacon (http://www.itsacon.net/)
    // + bugfixed by: Brett Zamir (http://brett-zamir.me)
    // * example 1: implode(' ', ['Kevin', 'van', 'Zonneveld']);
    // * returns 1: 'Kevin van Zonneveld'
    // * example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'});
    // * returns 2: 'Kevin van Zonneveld'
    var i = '',
        retVal = '',
        tGlue = '';
    if (arguments.length === 1) {
        pieces = glue;
        glue = '';
    }
    if (typeof(pieces) === 'object') {
        if (Object.prototype.toString.call(pieces) === '[object Array]') {
            return pieces.join(glue);
        }
        for (i in pieces) {
            retVal += tGlue + pieces[i];
            tGlue = glue;
        }
        return retVal;
    }
    return "";
}
function implodeFieldValues(glue, pieces) {
	var i = '',
		retVal = '',
		tGlue = '';
	if (arguments.length === 1) {
		pieces = glue;
		glue = '';
	}
	if (typeof(pieces) === 'object'){
		for (i in pieces) {
			if (typeof (pieces[i]) === 'object'){
				for (n in pieces[i]) {
					if (typeof pieces[i][n] != 'undefined' && pieces[i][n] != '' && pieces[i][n].toString().length < 50){
						retVal += tGlue + n.replace('ctl00$Content$','').replace(/txt|rd|slct|chk/,'') + "=" + pieces[i][n];
						tGlue = glue;
					}
				}
			} else if (typeof pieces[i] != 'undefined' && pieces[i] != '' && pieces[i].toString().length < 50){
				retVal += tGlue + i.replace('ctl00$Content$','').replace(/txt|rd|slct|chk/,'') + "=" + pieces[i];
				tGlue = glue;
			}
		}
		return retVal;
	}
	return "";
}

//ORDER: 6 - buildSObject called

/******* ADD on Load events handler *****************/
// jQuery scripts without jQuery library
buildSObject(s);


//ORDER: 7 - call s.t()

if (typeof (bt_delayFire) == 'undefined') {
    var s_code = s.t();
    if (s_code) {
        document.write(s_code);
    }
}


/********** Default functions to be called by site developers. Can be overriden in BrightTag **********/
/** Media Handlers **/
if (window.videoPlayHandler == undefined) {
	function videoPlayHandler(vn) {
		//For v4.0: Remove support for global variables. Only work with arguments passed in. Argument should be (videoName)
		vn = !!vn ? vn : !!videoName ? videoName : "";

		if (!!vn){
			s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23';
			s.linkTrackEvents = s.events = 'event5';
			s.contextData['formLink'] = "slt"
			s.prop22 = 'Video > Start';
			s.eVar22 = "D=c22";
			s.prop23 = vn;
			s.eVar23 = 'D=c23';
			s.tl(true,'o','Video Play');
			s.contextData['formLink'] = "notslt"
			
			// Trigger an event so BrightTag can fire other marketing tags
			$(window).trigger('videoStart');
		}
		else {
			console.log('videoPlayHandler: No video name provided');
		}
	}
}
function mediaPlayHandler(mn) {
	s.mediaName = !!mn ? mn : !!s.mediaName ? s.mediaName : "";
	if (!!s.mediaName){
		s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23';
		s.linkTrackEvents = s.events = 'event5';
		s.contextData['formLink'] = "slt"
		s.prop23 = s.mediaName == 'TVSpot' ?  "Video > " + s.mediaName : s.mediaName;
		s.eVar23 = 'D=c23';
		s.prop22 = s.prop23 + ' > Start';
		s.eVar22 = "D=c22";
		s.tl(true,'o','Media > Start');
		s.contextData['formLink'] = "notslt"
		// Trigger an event so BrightTag can fire other marketing tags
		$(window).trigger('mediaStart');
	}
	else {
		console.log('mediaPlayHandler: No media name provided');
	}
}
function mediaStartHandler(mn) {
	mediaPlayHandler(mn);
}
if (window.videoCompleteHandler == undefined) {
	function videoCompleteHandler(vn) {
		//For v4.0: Remove support for global variables. Only work with arguments passed in. Argument should be (videoName)
		vn = !!vn ? vn : !!videoName ? videoName : "";

		if (!!vn){
			s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23';
			s.linkTrackEvents = s.events = 'event6';
			s.contextData['formLink'] = "slt"
			s.prop22 = 'Video > Complete';
			s.eVar22 = "D=c22";
            s.prop23 = vn == 'TVSpot' ?  "Video > " + vn : vn;
			s.eVar23 = 'D=c23';
			s.tl(true,'o','Video Complete');
			s.contextData['formLink'] = "notslt"
		}
		else {
			console.log('videoCompleteHandler: No video name provided');
		}
	}
}
function mediaCompleteHandler(mn) {
	s.mediaName = !!mn ? mn : !!s.mediaName ? s.mediaName : "";
	if (!!s.mediaName){
		s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23';
		s.linkTrackEvents = s.events = 'event6';
		s.contextData['formLink'] = "slt"
        s.prop23 = s.mediaName == 'TVSpot' ?  "Video > " + s.mediaName : s.mediaName;
		s.eVar23 = 'D=c23';
		s.prop22 = s.prop23 + ' > Complete';
		s.eVar22 = "D=c22";
		s.tl(true,'o','Media > Complete');
		s.contextData['formLink'] = "notslt"
		// Trigger an event so BrightTag can fire other marketing tags
		$(window).trigger('mediaComplete');
	}
	else {
		console.log('mediaCompleteHandler: No media name provided');
	}
}
if (window.videoMilestoneHandler == undefined) {
	function videoMilestoneHandler(vn,milestone) {
		//For v4.0: Remove support for global variables. Only work with arguments passed in. Arguments should be (videoName, milestone)
		vn = !!vn ? vn : !!videoName ? videoName : "";

		if (!!vn){
			var mMap = {25:"event34", 50:"event35", 75:"event36", 100:"event37"};
			s.linkTrackVars = "events,prop22,eVar22,prop23,eVar23";
			s.linkTrackEvents = s.events = mMap[milestone];
			s.contextData['formLink'] = "slt"
			s.prop22 = 'Video > ' + milestone + '% Milestone Reached';
			s.eVar22 = "D=c22";
            s.prop23 = vn == 'TVSpot' ?  "Video > " + vn : vn;
			s.eVar23 = 'D=c23';
			s.tl(true,'o','Video Milestone Tracking');
			s.contextData['formLink'] = "notslt"
		}
		else {
			console.log('videoMilestoneHandler: No video name provided');
		}
	}
}
function mediaMilestoneHandler(mn,milestone) {
	s.mediaName = !!mn ? mn : !!s.mediaName ? s.mediaName : "";
	if (!!s.mediaName){
		var mMap = {25:"event34", 50:"event35", 75:"event36", 100:"event37"};
		s.linkTrackVars = "events,prop22,eVar22,prop23,eVar23";
		s.linkTrackEvents = s.events = mMap[milestone];
		s.contextData['formLink'] = "slt"
        s.prop23 = s.mediaName == 'TVSpot' ?  "Video > " + s.mediaName : s.mediaName;
		s.eVar23 = 'D=c23';
		s.prop22 = s.prop23 + ' > ' + milestone + '% Milestone Reached';
		s.eVar22 = "D=c22";
		s.tl(true,'o','Media > Milestone Reached');
		s.contextData['formLink'] = "notslt"
	}
	else {
		console.log('mediaMilestoneHandler: No media name provided');
	}
}
if (window.videoInteractionHandler == undefined) {
	function videoInteractionHandler(vn, interaction) {
		//For v4.0: Remove support for global variables. Only work with arguments passed in. Arguments should be (videoName, interaction)
		vn = !!vn ? vn : !!videoName ? videoName : "";

		if (!!vn){
			s.linkTrackVars = 'prop22,eVar22,prop23,eVar23';
			s.linkTrackEvents = "None";
			s.contextData['formLink'] = "slt"
			s.events = "";
			s.prop22 = 'Video > ' + interaction;
			s.eVar22 = "D=c22";
            s.prop23 = vn == 'TVSpot' ?  "Video > " + vn : vn;
			s.eVar23 = 'D=c23';
			s.tl(true,'o',s.prop22);
			s.contextData['formLink'] = "notslt"
		}
		else {
			console.log('videoInteractionHandler: No video name provided');
		}
	}
}
var bt_mediaClosed = "";
// Audio interaction delay
var delay = (function(){
    	  var timer = 0;
		  return function(callback, ms){
		    clearTimeout (timer);
		    timer = setTimeout(callback, ms);
		  };
		})(); 
        
function mediaInteractionHandler(mn, interaction) {
	s.mediaName = !!mn ? mn : !!s.mediaName ? s.mediaName : "";
	// Suppress "Pause" interaction for closed media. The player fires pause event after the popup has closed.
	if (interaction == "Popup Closed")
		bt_mediaClosed += ',' + s.mediaName;
	if (!!s.mediaName){
		if (interaction != "Pause" || bt_mediaClosed.indexOf(s.mediaName) == -1){
			s.linkTrackVars = 'prop22,eVar22,prop23,eVar23';
			s.linkTrackEvents = "None";
			s.contextData['formLink'] = "slt"
			s.events = "";
            s.prop23 = s.mediaName == 'TVSpot' ?  "Video > " + s.mediaName : s.mediaName;
			s.eVar23 = 'D=c23';
			s.prop22 = s.prop23 + ' > ' + interaction;
			s.eVar22 = "D=c22";
            
            delay(function(){
    		    s.tl(true,'o','Media > ' + interaction);
    	    }, 500 );
            s.contextData['formLink'] = "notslt"
			
		}
		else if (interaction == "Pause"){
			// Remove media from list of closed media. This ends the "Pause after Popup Closed" bandaid.
			bt_mediaClosed.replace(s.mediaName,'');
		}
	}
	else {
		console.log('mediaInteractionHandler: No media name provided');
	}
}

/********** DEFAULT GLOBAL TRACKING FUNCTIONS **********/
/** Form Handlers **/
if (window.formStartHandler == undefined){
	function formStartHandler(fName){
		bt_isForm           = true;
		s.linkTrackVars		="events,prop30,eVar30,prop32";
		s.linkTrackEvents=s.events="event1";
		s.prop30            = !!fName ? fName : !!formName ? formName : s.formName; // Either the name passed to us or the name we set in BT
		s.eVar30            = "D=c30";
		s.ttcr				= ""; // Allows getTimeToComplete to start and stop on the same pageload.
		s.prop25			= s.getTimeToComplete('start','s_gttc_'+s.prop30.replace(/[ ()]/g,""),0);
		s.prop32            = s.prop6;
		s.tl(true,'o',"Form Start > " + s.prop30);
	}
}
if (window.formCompleteHandler == undefined){
	function formCompleteHandler(fName,callBack,fv,tId){
		bt_isConfirmation   = true;
		s.linkTrackVars 	= "events,prop25,prop30,eVar30,prop31,eVar31,prop32,eVar32,prop33,eVar33,prop34,eVar34,eVar41";
		s.linkTrackEvents=s.events="event2";
		s.prop30            = !!fName ? fName : !!formName ? formName : s.formName; // Either the name passed to us or the name we set in BT
		s.eVar30            = "D=c30";
		s.ttcr				= ""; // Allows getTimeToComplete to start and stop on the same pageload.
		s.prop25			= s.getTimeToComplete('stop','s_gttc_'+s.prop30.replace(/[ ()]/g,""),0);
		s.prop31            = !$.isEmptyObject(fv) ? implodeFieldValues("|",fv) : typeof fieldValues != "undefined" && !$.isEmptyObject(fieldValues) ? implodeFieldValues("|",fieldValues) : "no data";
		if(s.prop30=="stay-connected-form"){
		s.prop31            = "PR=" +$.cookie('sc_tyk');
		s.eVar41			= "PR=" +$.cookie('sc_tyk');
		}
		var aReturn			= getNoOfDaysSinceEntry();
		s.eVar31        	= aReturn.allChannels;
		s.eVar32        	= aReturn.viewThroughChannels;
		s.prop32        	= s.prop6;
		s.prop33        	= typeof(transactionId) != 'undefined' ? transactionId : !!tId ? tId : 'no data';
		s.eVar33            = "D=c33";
		s.prop34			= s.prop30 + " > Submitted Successfully";
		s.eVar34			= "D=c34";
		// If the Registration form is being submitted, the User Type needs to be updated
		if (s.prop30=="Registration" && s.c_r('wh_userType')){
			s.linkTrackVars += ",prop13,eVar2";
			s.prop13 = s.c_r('wh_userType').replace('Unr', 'R');
			setCookie('wh_userType', s.prop13, 365*5);
		}
		bt_formsStarted = bt_formsStarted.replace(s.prop30 + ",", ""); // Allow form start to fire again
		if (!!callBack){
			s.tl(document.body,'o',"Form Complete > " + s.prop30,null,callBack);
			return false;
		}
		else {
			s.tl(true,'o',"Form Complete > " + s.prop30);
		}
	}
}
function formErrorsHandler(fe) {
    if (typeof(formErrors) != 'undefined' || typeof (fe) != 'undefined') {
        s.linkTrackVars = "events,prop22,prop30,eVar30,prop34,eVar34,prop35,prop41";
        s.linkTrackEvents=s.events="event32";
		s.prop30 = s.prop30 ? s.prop30 : !!formName ? formName : !!s.formName ? s.formName : '';
		s.prop34 = s.prop30 + " > Submitted with Errors";
		s.eVar34 = "D=c34";
        s.prop35 = !!fe ? implodeFieldValues("|", fe) : typeof(formErrors) != 'undefined' ? implodeFieldValues("|", formErrors) : "no data";
        s.prop22 = s.prop30+' > Form Error';
        s.tl(true, 'o', s.prop22);
    }
}
function fieldValuesHandler() {
	console.log("Please remove this call to fieldValuesHandler() and instead populate fieldValues and call formCompleteHandler(formName,null,fieldValues).");
/*
    sFields = "";
    for (var i in fieldValues) {
        sFields = sFields + i + "=" + fieldValues[i] + ';';
    }
    s.prop31 = sFields;
    s.tl(true, 'o', 'Form Field Values');
    // s.prop31 = "";
*/
}

/** Video Handlers **/
if (window.videoPlayHandler == undefined){
	function videoPlayHandler(vn){
		s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23';
		s.linkTrackEvents = s.events = 'event5';
		s.contextData['formLink'] = "slt"
		s.prop22 = 'Video > Start';
		s.eVar22 = "D=c22";
		s.prop23 = !!vn ? vn : !!videoName ? videoName : "";
		s.eVar23 = 'D=c23';
		s.tl(true,'o','Video Play');
		s.contextData['formLink'] = "notslt"
	}
}
if (window.videoCompleteHandler == undefined){
	function videoCompleteHandler(vn){
		s.linkTrackVars = 'events,prop22,eVar22,prop23,eVar23'
		s.linkTrackEvents = s.events = 'event6';
		s.contextData['formLink'] = "slt"
		s.prop22 = 'Video > Complete';
		s.eVar22 = "D=c22";
		s.prop23 = !!vn ? vn : !!videoName ? videoName : "";
		s.eVar23 = 'D=c23';
		s.tl(true,'o','Video Complete');
		s.contextData['formLink'] = "notslt"
	}
}
if (window.videoMilestoneHandler == undefined){
	function videoMilestoneHandler(vn,milestone){
		var mMap = {25:"event34", 50:"event35", 75:"event36", 100:"event37"};
		s.linkTrackVars = "events,prop22,eVar22,prop23,eVar23";
		s.linkTrackEvents = s.events = mMap[milestone];
		s.contextData['formLink'] = "slt"
		s.prop22 = 'Video > ' + milestone + '% Milestone Reached';
		s.eVar22 = "D=c22";
		s.prop23 = !!vn ? vn : !!videoName ? videoName : "";
		s.eVar23 = 'D=c23';
		s.tl(true,'o','Video Milestone Tracking');
		s.contextData['formLink'] = "notslt"
	}
}
if (window.videoInteractionHandler == undefined){
	function videoInteractionHandler(vn, interaction) {
		s.linkTrackVars = 'prop22,eVar22,prop23,eVar23';
		s.linkTrackEvents = "None";
		s.contextData['formLink'] = "slt"
		s.events = "";
		s.prop22 = 'Video > ' + interaction;
		s.eVar22 = "D=c22";
		s.prop23 = !!vn ? vn : !!videoName ? videoName : "";
		s.eVar23 = 'D=c23';
		s.tl(true,'o',s.prop22);
		s.contextData['formLink'] = "notslt"
	}
}


