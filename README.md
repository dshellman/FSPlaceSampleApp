# FSPlaceSampleApp

FamilySearch Place API Sample App

This is a sample application that uses the FamilySearch Place API.

To use this sample, find the settings.jsp file and add your FamilySearch developer key to the appropriate place.

This project builds using Maven 3.  It produces a war file that can be deployed to a servlet container (e.g. Tomcat).

Note, though that the settings.jsp file can be replaced as a json file so that a war file/serlvet container are not necessary.
However, a back-end (whether a servlet container or node.js or other) is necessary and recommended to make the unauthenticated
session call to get the access token needed to make the RESTful calls to the Place API.



