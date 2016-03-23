<%-- 
    Document   : index
    Created on : Mar 22, 2016, 7:42:57 PM
    Author     : Logan
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Space Invaders: Log IN</title>
    </head>
    <body>
        <% 
            if(request.getParameter("failedLogin") == true){
                
            }
        %>
        <form id="login" name="login" action="index.jsp" method="post">
            <label id="lblUsersname" for="txtUsername">Enter Name: </label>
            <input type="text" id="txtUsername" />
            <br />
            <label id="lblPassword" for="txtPassword">Enter Password:</label>
            <input type="password" id="txtPassword" />
            <br />
            <input type="submit" id="btnSumbit" value="Submit">
            <a href="Register.jsp">Register</a>
        </form>
    </body>
</html>
