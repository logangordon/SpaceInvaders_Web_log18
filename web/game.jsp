<%-- 
    Document   : game.jsp
    Created on : Mar 23, 2016, 12:03:24 AM
    Author     : Logan
--%>

<%@page import="edu.pitt.is1017.spaceinvaders.User"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Space Invaders: The Game</title>
        <link href="assets/css/game_assets.css" rel="stylesheet" type="text/css"/>
        <script src="assets/js/jquery-1.12.3.min.js" type="text/javascript"></script>
        <script src="assets/js/game_engine.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="gamearea" class="game-asset">
            <h2 id="Status">Loading Game</h2>
            <table id="aliens" class="game-asset"></table>
            <img id="ship" class="game-asset" src="assets/images/ship.gif" alt="Our noble and dashing protagonist"/>
        </div>
    </body>
</html>


