import serial
import serial.tools.list_ports

rbSer = None

connectd = False

#COM PORT STUFF
ports = list(serial.tools.list_ports.comports())
for p in ports:
    rbSer = serial.Serial(p[0], 9600, timeout=10)
    line = rbSer.readline()
    #print(line.decode())
    rbSer.write("<HAV_pi>\n".encode())
    line = rbSer.readline()
    if "<HAV_rb>" in line.decode():
        #print(line.decode())
        connectd = True
    if connectd == True:
        rbSer.flushInput()
        rbSer.flushOutput()
        rbSer.close()

        #f = open("comport.txt", "w")
        print(p[0]);

        #print("<COM_Grabber> Comport saved to file!")
        #return p[0];
        break

