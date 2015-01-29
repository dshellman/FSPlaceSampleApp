<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8" %>
<%
String identData = "";
//Set your dev key as a system property (property name of 'auth_key')
//Or, hard-code it below
String identKey = System.getProperty( "auth_key" );
if ( identKey == null || identKey.trim().equals( "" ) ) {
	identKey = "Put Your Dev Key Here!";
}
identData = "ip_address=localhost&grant_type=unauthenticated_session&client_id=" + identKey;

String identURL = System.getProperty( "auth_ws" );
if ( identURL == null || identURL.trim().equals( "" ) ) {
	identURL = "https://identbeta.familysearch.org/cis-web/oauth2/v3/token";
}

String baseURL = System.getProperty( "place_ws" );
if ( baseURL == null || baseURL.trim().equals( "" ) ) {
	baseURL = "https://beta.familysearch.org/platform";
}

System.out.println( "identity url: " + identURL );
System.out.println( "base url: " + baseURL );

//Perform login to get the access token
java.net.HttpURLConnection	con = ( java.net.HttpURLConnection ) new java.net.URL( identURL ).openConnection();
con.setRequestMethod( "POST" );
con.setDoOutput( true );
con.setDoInput( true );
con.setRequestProperty( "Accept-Charset", "UTF-8" );
con.setRequestProperty( "Accept", "application/json" );
con.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded" );
con.setRequestProperty( "Content-Length", "" + identData.getBytes().length );

java.io.InputStream	input = null;
StringBuilder 		theToken = new StringBuilder();

try {
	java.io.DataOutputStream dataOut = new java.io.DataOutputStream( con.getOutputStream() );
	dataOut.writeBytes( identData );
	dataOut.flush();
	dataOut.close();

	input = con.getInputStream();

	java.io.BufferedReader	reader = new java.io.BufferedReader( new java.io.InputStreamReader( input ) );
	String	line;

	line = reader.readLine();
	while ( line != null ) {
		theToken.append( line );
		line = reader.readLine();
	}
	System.out.println( "Token: " + theToken.toString() );
}
catch ( java.io.IOException e ) {
	System.out.println( e.getMessage() );
	e.printStackTrace();
}
finally {
	if ( input != null ) {
		input.close();
	}
}

%>
{
    "placeEndPoints": {
        "BASE_URL": "<%= baseURL %>",
        "PLACE": "<%= baseURL + "/places" %>",
        "PLACE_SEARCH": "<%= baseURL + "/places/search" %>",
        "PLACE_DESCRIPTION": "<%= baseURL + "/places/description" %>",
        "PLACE_TYPE": "<%= baseURL + "/places/types" %>",
        "PLACE_TYPE_GROUP": "<%= baseURL + "/places/type-groups" %>",
        "PLACE_REP_GROUP": "<%= baseURL + "/places/place-rep-groups" %>"
    },
    "accessToken": <%= theToken.toString() %>
}
<%
//Access token will be in the following format:
//"accessToken":
//{
//  "token": "<token>",
//  "access_token": "<token>",
//  "token_type": "family_search"
//}
%>